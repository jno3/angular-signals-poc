# angular-signals-poc

## A study regarding angular signals, how they work and what could be done to improve them

### What are Signals?

Signals as described in the [angular documentation](https://angular.dev/guide/signals):

>A signal is a wrapper around a value that notifies interested consumers when that value changes. Signals can contain any value, from primitives to complex data structures.
>
>You read a signal's value by calling its getter function, which allows Angular to track where the signal is used.
>
>Signals may be either writable or read-only.

Signals are a way for angular to know exactly which components depend on which signal. It is a way of tracking where a certain state is used, with the dependency recorded at the component level.

When analyzing actual angular code, we may find the following:

For an angular component that reads

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Hello, {{ world() }}</h1>
    <h1>Hello, {{ name() }}</h1>
  `,
})
export class App {
  protected readonly world = signal('world');
  name(){
    return 'João';
  }
}
```

We get a compiled main.js that (among other things) gives

```js
// src/app/app.ts
var App = class _App {
  world = signal(
    "world",
    ...ngDevMode ? [{ debugName: "world" }] : (
      /* istanbul ignore next */
      []
    )
  );
  name() {
    return "João";
  }
  static ɵfac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({ type: _App, selectors: [["app-root"]], decls: 4, vars: 2, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵdomElementStart(0, "h1");
      ɵɵtext(1);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(2, "h1");
      ɵɵtext(3);
      ɵɵdomElementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵtextInterpolate1("Hello, ", ctx.world());
      ɵɵadvance(2);
      ɵɵtextInterpolate1("Hello, ", ctx.name());
    }
  }, encapsulation: 2 });
};

```
What does that mean and what exactly is my signal doing here? the nitty-gritty is - template is a `function` that receives `rf` and `ctx`.

`ctx` is the context, the component instance, since template is a standalone function, the ctx is passed. It would be something analogue to using `this`.

`rf` is a render flag that tells the template function which phase is being called. Inside the `function` it is compared using the bitwise AND operation where the block following `if (rf & 1)` means creation mode and the block following `if (rf & 2)` means update mode. What prompted this study is the fact that both the signal and the method are called inside this update block and there isn't much distinction between how they are being called. So the question I had was: What is effectively the difference between a signal call and a method call inside a template?

Well, a method being called inside the update block, like `ɵɵtextInterpolate1("Hello, ", ctx.name());` runs every time the block runs, and Angular knows nothing about what it reads, it can only find whether the result changes by calling it and comparing it with the stored value through the method `bindingUpdated` that is called indirectly inside `ɵɵtextInterpolate1`. The chain goes as `ctx.name (value may or may not have changed) -> ɵɵtextInterpolate1 -> interpolation1 -> bindingUpdated`, So:


```js
function ɵɵtextInterpolate1(prefix, v0, suffix) {
  const lView = getLView();
  const interpolated = interpolation1(lView, prefix, v0, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated);
  }
  return ɵɵtextInterpolate1;
}
```

```js
function interpolation1(lView, prefix, v0, suffix = "") {
  const different = bindingUpdated(lView, nextBindingIndex(), v0);
  return different ? prefix + renderStringify(v0) + suffix : NO_CHANGE;
}
```

```js
function bindingUpdated(lView, bindingIndex, value) {
  ngDevMode && assertLessThan(bindingIndex, lView.length, `Slot should have been initialized to NO_CHANGE`);
  if (value === NO_CHANGE) {
    return false;
  }
  const oldValue = lView[bindingIndex];
  if (Object.is(oldValue, value)) {
    return false;
  } else {
    if (ngDevMode && isInCheckNoChangesMode()) {
      const oldValueToCompare = oldValue !== NO_CHANGE ? oldValue : void 0;
      if (!devModeEqual(oldValueToCompare, value)) {
        const details = getExpressionChangedErrorDetails(lView, bindingIndex, oldValueToCompare, value);
        throwErrorIfNoChangesMode(oldValue === NO_CHANGE, details.oldValue, details.newValue, details.propName, lView);
      }
      return false;
    }
    lView[bindingIndex] = value;
    return true;
  }
}
```

When it comes to signals, the only thing that changes is the first step. Since signals are defined as:

```js
function signal(initialValue, options) {
  const [get, set, update] = createSignal(initialValue, options?.equal);
  const signalFn = get;
  const node = signalFn[SIGNAL];
  signalFn.set = set;
  signalFn.update = update;
  signalFn.asReadonly = signalAsReadonlyFn.bind(signalFn);
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    const debugName = options?.debugName;
    node.debugName = debugName;
    signalFn.toString = () => `[Signal${debugName ? " (" + debugName + ")" : ""}: ${signalFn()}]`;
  }
  return signalFn;
}
```

A signal differs only in what the getter does. `signalGetFn` calls `producerAccessed`, which, while the view’s template consumer is active, records that this view depends on the signal, and then returns the value. A later `set` marks that consumer dirty, which marks the view for refresh. Because the dependency is recorded for the view and not for each binding, the whole update block re-runs, and in a view with 10 signals, changing one means all 10 getters are called again.

```js
function signalGetFn(node) {
  producerAccessed(node);
  return node.value;
}
```

```js
function producerAccessed(node) {
  if (inNotificationPhase) {
    throw new Error(typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : "");
  }
  if (activeConsumer === null) {
    return;
  }
  activeConsumer.consumerOnSignalRead(node);
  const prevProducerLink = activeConsumer.producersTail;
  if (prevProducerLink !== void 0 && prevProducerLink.producer === node) {
    return;
  }
  let nextProducerLink = void 0;
  const isRecomputing = activeConsumer.recomputing;
  if (isRecomputing) {
    nextProducerLink = prevProducerLink !== void 0 ? prevProducerLink.nextProducer : activeConsumer.producers;
    if (nextProducerLink !== void 0 && nextProducerLink.producer === node) {
      activeConsumer.producersTail = nextProducerLink;
      nextProducerLink.lastReadVersion = node.version;
      nextProducerLink.knownValidAtEpoch = epoch;
      return;
    }
  }
  const prevConsumerLink = node.consumersTail;
  if (prevConsumerLink !== void 0 && prevConsumerLink.consumer === activeConsumer && (!isRecomputing || prevConsumerLink.knownValidAtEpoch === epoch)) {
    return;
  }
  const isLive = consumerIsLive(activeConsumer);
  const newLink = {
    producer: node,
    consumer: activeConsumer,
    nextProducer: nextProducerLink,
    prevConsumer: void 0,
    knownValidAtEpoch: epoch,
    lastReadVersion: node.version,
    nextConsumer: void 0
  };
  activeConsumer.producersTail = newLink;
  if (prevProducerLink !== void 0) {
    prevProducerLink.nextProducer = newLink;
  } else {
    activeConsumer.producers = newLink;
  }
  if (isLive) {
    producerAddLiveConsumer(node, newLink);
  }
}
```

### A way to make Signals more granular?
Then came the question of how would one make a signal more granular? How could I make setting up a new value in a signal something that would only affect that signal and not trigger the read on all signals in my update block? In order to set that up I had to find a way of recompiling the output of an Angular code into something that I could then manipulate and rewrite however I wanted in JavaScript. The first step was getting a JSON file containing the nodes that generate my template. That is done inside angular with method `parseTemplate`. It generates an AST that angular itself uses before actually compiling the code. I limited my usage of that JSON file to the parts that actually mattered to me - that being interpolations and the calling of methods. So, for example, my template:

```html
<h1>Hello, {{ world() }}</h1>
<h1>Hello, {{ name() }}</h1>
```

Would then turn into this [JSON](docs/example-1.json) and the parts that mattered to me would be the name of the attribute, that being the node's tag name that it contained and its children components, be it other tags, plaintext calls or the methods and its parameters that were being invoked (or not) inside my template. I devised an AST interpreter for these cases in OCaml and implemented it as documented in this repo. The [node.ml](lib/node.ml) is described as:

```OCaml
type expr = 
  | PropertyRead of string
  | MethodCall of string * expr list
and node = 
  | Interpolation of string list * expr list
  | Element of string * node list
  | Static of string
[@@deriving show]
```

Where `expr` would deal with the expressions being called inside my AST, divided into `PropertyRead` that takes bare names, like `{{ name }}` and stores it and `MethodCall` that deals with methods being called inside my template, carrying the method (or signal) name and its arguments.

The other type I used was `node` that had `Interpolation` that defines data in order to turn an interpolation like `Hello, {{ name() }}` into `"Hello, João"`. `Element` that defined the whole structure (where recursivity came into place), getting the name of `node` and its children, even if the children themselves were `node`. And `Static` for static text inside my HTML file, for example if a tag didn't have an interpolation inside it and just a string.

The different treatment I tried in this test case was generating three files from my AST - two JS files and an HTML file:

The generated JS scripts were composed of a context, `ctx.js`, and the create and update methods, `filename.js`.

The generated HTML file `filename.html` is basically an outlet so one can view the JavaScript through the browser.

Inside the scripts directory, I have two scripts for helping me create and analyze the file with my OCaml AST interpreter. [gen_scenario.ts](resources/scripts/gen_scenario.ts) that takes an argument N and creates an angular application with N bindings inside my dummy Angular component [app.ts](resources/codegen-poc/src/app/app.ts) and [analyzer.ts](resources/scripts/analyzer.ts) that reads said file and generates `ctx.js`, the context for my faux-angular and the `ast.json` that is read by my OCaml and, since I'm working from the template out and, inside a template, a method and a signal call don't really differ (`{{ call() }}`), analyzer gets all signals explicitly and writes a `signals.json` that is also read by my OCaml application. If I pass the flag `-s` when executing my OCaml app, the signals noted in the json file are ignored and treated all as if they were methods, otherwise they get treated as signals. So I'll call these different modes as `signal mode` and `polled mode`.

And to answer the question posed in this subsection, my idea for making signals more granular would be relying more on individual updates instead of updating a whole block for a single signal change. I did that inside the [runtime.js](resources/page/runtime.js) file that contains a new definition for method `signal`, a producer, a method that holds a value (initial signal value) and holds a set of subscribers. So instead of emitting the interpolation inside the update block, I wrap it in an `effect` created once in the `create` block. `effect` is the consumer that detects the changes in the `signal` it is attached to and updates the text content of the HTML piece that is directly affected.

### runtime.js
`runtime.js` is what keeps the experiment controlled for both modes - later when I'm testing my experiment, the methods called inside interpolation will be interpreted as methods or as signals depending on the `-s` flag, regardless, both will use `runtime.js`.

`runtime.js` exports `signal`, `effect` and `stats`, defined as:

```js
let activeEffect = null;

export const stats = { effectRuns: 0 };

export function signal(initial) {
  let value = initial;
  const subscribers = new Set();

  function read() {
    if (activeEffect) subscribers.add(activeEffect);
    return value;
  }

  read.set = (next) => {
    if (Object.is(next, value)) return;
    value = next;
    for (const run of [...subscribers]) run();
  };

  read.update = (fn) => read.set(fn(value));

  return read;
}

export function effect(fn) {
  const run = () => {
    stats.effectRuns++;
    const previous = activeEffect;
    activeEffect = run;
    try {
      fn();
    } finally {
      activeEffect = previous;
    }
  };
  run();
}
```

Function `signal` is used inside the generated `ctx.js` since it contains the context for my faux-angular application and `effect` will be used inside `create` block in the generated js file when in `signal mode`.

### Testing
Our AST interpreter has two modes, `polled mode` and `signal mode`. The former treats the calls inside interpolations as methods, the latter treats them as signals tracked with effect. We need test cases to see what improvement signal mode could bring.

My idea is that in `polled mode` the work done in each write grows with the number of bindings, because every binding is read again on every update. In `signal mode` it should stay constant, because only the effects that depend on the written signal run.

Using the scripts before mentioned, one could run the following from the root of this project:
```bash
npx tsx resources/scripts/gen_scenario.ts 10
npx tsx resources/scripts/analyzer.ts
```
This will generate [ctx.js](docs/ctx-example.js), [ast.json](docs/ast-generated-example.json) and [signals.json](docs/signals-example.json). The AST interpreter, as described before, will use the generated `ast.json` and transform it into a js file. The way it interprets the calls from inside the interpolations will depend entirely on the `-s` flag. So, running the command OCaml application as:

```bash
dune exec ast-to-js -- -o signals_10
```

Will give me the [signals_10.js](docs/signals_10-example.js) file. Notice how the `effect` method is being used. Now if I run the application with `-s`:

```bash
dune exec ast-to-js -- -o polled_10 -s
```

I get the [polled_10.js](docs/polled_10-example.js) file. The one that tries to replicate how an angular application works from a compiled angular source. Example of the `app.ts` piece generated inside the main.js in our angular `codegen-poc`:

<details>
<summary>Compiled output for <code>App</code> (excerpt from main.js)</summary>

```js
// src/app/app.ts
var App = class _App {
  s0 = signal(
    0,
    ...ngDevMode ? [{ debugName: "s0" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s1 = signal(
    1,
    ...ngDevMode ? [{ debugName: "s1" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s2 = signal(
    2,
    ...ngDevMode ? [{ debugName: "s2" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s3 = signal(
    3,
    ...ngDevMode ? [{ debugName: "s3" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s4 = signal(
    4,
    ...ngDevMode ? [{ debugName: "s4" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s5 = signal(
    5,
    ...ngDevMode ? [{ debugName: "s5" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s6 = signal(
    6,
    ...ngDevMode ? [{ debugName: "s6" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s7 = signal(
    7,
    ...ngDevMode ? [{ debugName: "s7" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s8 = signal(
    8,
    ...ngDevMode ? [{ debugName: "s8" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s9 = signal(
    9,
    ...ngDevMode ? [{ debugName: "s9" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static ɵfac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({ type: _App, selectors: [["app-root"]], decls: 20, vars: 10, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵdomElementStart(0, "p");
      ɵɵtext(1);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(2, "p");
      ɵɵtext(3);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(4, "p");
      ɵɵtext(5);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(6, "p");
      ɵɵtext(7);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(8, "p");
      ɵɵtext(9);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(10, "p");
      ɵɵtext(11);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(12, "p");
      ɵɵtext(13);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(14, "p");
      ɵɵtext(15);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(16, "p");
      ɵɵtext(17);
      ɵɵdomElementEnd();
      ɵɵdomElementStart(18, "p");
      ɵɵtext(19);
      ɵɵdomElementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵtextInterpolate(ctx.s0());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s1());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s2());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s3());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s4());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s5());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s6());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s7());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s8());
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.s9());
    }
  }, encapsulation: 2 });
};
```

</details>

<br>

#### bench.html

To test these files we'll use the [bench.html](/resources/page/bench.html) file that will import the `stats` from `runtime.js` and `ctx` from the generated `ctx.js`. It takes one required argument, `page`, to point which generated js file we'll be testing (like `?page=polled_10`), and two optional parameters, `write` to select a signal for writing onto (like `&write=s0`) and `writes` that sets how many writes to time (like `&writes=9000`). The number of `rounds` is fixed to 5.

It wraps every `signal` in `ctx` with a read counter. Each wrapper does `reads++` right before calling the real `signal`, so we can keep track and still use the `signal`.

Then it imports the generated page and calls `create(app, ctx)` and `update(refs, ctx)`. That is the first render. Right after it, it takes a snapshot of the text in every element. Every signal starts with a different value, so the elements showing the initial value of the signal being written are the ones that depend on it. After that it does two separate things:

1. **Single-write measurement.** It resets `reads`, runs `ctx[target].set(999999)` and then `update(refs, ctx)`. This gives us `reads/write` and `effect runs/write`. It then checks for correctness: every element that depends on the signal must show `999999` and every other element must be unchanged.
2. **Timing.** It runs 5 rounds, and each round does `writes` cycles of `set` with a new value followed by `update`. A round is one timed batch. We repeat it to get rid of noise and report the median. Every write uses a different value because a signal ignores a `set` with the value it already has.

The results are:

| Result | What it means |
|--------|---------------|
| reads/write | The amount of times a read happened for a single write |
| effect runs/write | The amount of times an `effect` was run for a single write |
| bindings on the target | How many bindings depend on the signal being written (M, when using `--shared=M`) |
| median of 5 rounds x writes | The median time over 5 rounds for executing the amount of `writes` |
| correct | Whether the dependents show the written value and the other elements are unchanged |


#### Results
For generating the test files, I ran the following commands:
```bash
npx tsx resources/scripts/gen_scenario.ts N
npx tsx resources/scripts/analyzer.ts
dune exec ast-to-js -- -o signals_N
dune exec ast-to-js -- -o polled_N -s
```
And ran my `bench.html` tests for each N before generating the next N and so on. Each test used `&writes=9000`, and the median of the 5 rounds was divided by 9 to give the time per 1000 writes.

These tests were run in a Lenovo S145-IWL containing 8GB of RAM running Linux Mint.

| Software | Version |
|----------|---------|
| Browser (Firefox) | 154.0 |
| Node | v24.19.0 |
| @angular/compiler | 22.2.1 |
| TypeScript | 5.9.3 |
| tsx | 4.23.15 |
| OCaml | 5.4.1 |
| dune | 3.24.2 |

To run these tests, Firefox's `privacy.reduceTimerPrecision` and `privacy.resistFingerprinting` were set to `false`.

These were the results attained:

| N | Mode | reads/write | effect runs/write | median time per 1000 writes (ms) | correct |
|---|------|-------------|-------------------|------------------|---------|
| 10 | polled | 10 | 0 | 1.4 | true |
| 10 | signal | 1 | 1 | 0.5 | true |
| 100 | polled | 100 | 0 | 18.8 | true |
| 100 | signal | 1 | 1 | 0.5 | true |
| 1000 | polled | 1000 | 0 | 275.3 | true |
| 1000 | signal | 1 | 1 | 0.5 | true |

From the tests performed with independent bindings, I could conclude that `signal mode` does what I had described: whenever there is a write, it runs exactly one read and one effect run, whereas `polled mode` does N reads and takes longer to process a single write. The time follows the same pattern: in `polled mode` it grows a little faster than linearly (1.4, 18.8 and 275.3 ms, about 13x and 15x for each 10x in N), and `signal mode` stays flat at about 0.5 ms per 1000 writes. The gap widens with N, being roughly 3x at N=10, 40x at N=100 and 550x at N=1000. The `signal mode` times are rounded to one decimal, so these ratios are approximate.

So the cost of a write in `signal mode` depends on how many bindings depend on the signal, and not on how many bindings the template has. In `polled mode` it depends on the template size. In this synthetic workload, per-binding effects make the cost of a write constant in the size of the template, while the cost in `polled mode` grows with it, a little faster than linearly in these runs. The adverse scenarios below show where this stops being true.

#### Testing it against proper angular
This test checks whether `polled mode` is a fair model of Angular's update block.

For the Angular setup we generate the same template with `--counted`:
```bash
npx tsx resources/scripts/gen_scenario.ts N --counted
```
This version wraps every signal with a read counter and adds two buttons.

- The `Run test` that sets `READS = 0`, writes `s0` and waits for `appRef.whenStable()` and logs `READS`
- The `Run timer` that does 1000 writes in 5 rounds, in batches of 50 with a `setTimeout` yield between batches. This had to be done because with the Angular version being tested here (`22.2.1`) the default behavior is zoneless and in it many synchronous writes in one event-loop turn throw NG0103, so the timing has to yield between batches. Only the batch is timed, and the median is logged.

To set up these tests, besides replacing the `app.ts` file inside my angular with the previous command, I ran the following from inside the `./resources/codegen-poc` directory:

```bash
ng build --configuration production
npx http-server dist/codegen-poc/browser
```

So running my Angular application with the same N values used in the previous tests I get

| N | reads/write (Angular) | reads/write (polled mode) | median time per 1000 writes (ms) |
|---|-----------------------|---------------------------|------------------|
| 10 | 10 | 10 | 41 |
| 100 | 100 | 100 | 69 |
| 1000 | 1000 | 1000 | 183 |

The reads/write match exactly at every N, which is what we expected from how Angular records dependencies per view: one write re-runs the whole update block. This supports `polled mode` as a model of Angular's update block for this workload. The times are not comparable in absolute terms, since Angular's include its scheduler: `polled mode` is faster at N=10 and N=100 but slower at N=1000 (275.3 against 183 ms), so I draw no conclusion about which one is more efficient. What we can say is that in both cases the time grows with the number of bindings.

#### Adverse scenarios
So far we've been testing on a single write using a single bound interpolation from within our template. That is the best case scenario for the `signal mode`. It works because a single write requires a single read using our effects. What if there are multiple bindings in our template to a single signal? 

To execute these tests, we'll add a new flag in our `gen_scenario.ts` script to interpolate the same signal multiple times, one signal with many effects bound to it for writing purposes. The flag is `shared`. So, to generate our new templates with multiples bindings per signal:

```bash
npx tsx resources/scripts/gen_scenario.ts N --shared=M # where N is the number of bindings and M is how many of them read signal s0.
```

Example of a template with 5 bindings, 3 of them reading `s0` (`--shared=3`). The independent bindings keep their own index:

```html
<p>{{ s0() }}</p>
<p>{{ s0() }}</p>
<p>{{ s0() }}</p>
<p>{{ s3() }}</p>
<p>{{ s4() }}</p>
```

So running the same tests as before, now with shared:

| N | M | Mode | reads/write | effect runs/write | median time per 1000 writes (ms) | correct |
|---|---|------|-------------|-------------------|----------------------------------|---------|
| 10 | 3 | signal | 3 | 3 | 1.0 | true |
| 10 | 3 | polled | 10 | 0 | 1.7 | true |
| 10 | 6 | signal | 6 | 6 | 1.8 | true |
| 10 | 6 | polled | 10 | 0 | 2.0 | true |
| 10 | 9 | signal | 9 | 9 | 2.7 | true |
| **10** | **9** | **polled** | **10** | **0** | **2.5** | **true** |
| 100 | 30 | signal | 30 | 30 | 8.8 | true |
| 100 | 30 | polled | 100 | 0 | 20.0 | true |
| 100 | 60 | signal | 60 | 60 | 18.0 | true |
| 100 | 60 | polled | 100 | 0 | 20.3 | true |
| 100 | 90 | signal | 90 | 90 | 28.1 | true |
| **100** | **90** | **polled** | **100** | **0** | **20.4** | **true** |
| 1000 | 300 | signal | 300 | 300 | 107.3 | true |
| 1000 | 300 | polled | 1000 | 0 | 271.5 | true |
| 1000 | 600 | signal | 600 | 600 | 211.3 | true |
| 1000 | 600 | polled | 1000 | 0 | 277.9 | true |
| 1000 | 900 | signal | 900 | 900 | 333.2 | true |
| **1000** | **900** | **polled** | **1000** | **0** | **282.9** | **true** |

Bold marks the cases where polled mode was faster than signal mode.

Signal mode wins when few of the bindings share the written signal and loses when most of them do. With 30% of the bindings on `s0`, signal mode is about 2.3x faster at N=100 and 2.5x faster at N=1000. At 60% it is still ahead, by 13% at N=100 and 32% at N=1000. At 90% it is slower, by 38% at N=100 and 18% at N=1000. Interpolating linearly between the 60% and 90% points puts the break-even at about 67% of the bindings at N=100 and 77% at N=1000. N=10 follows the same pattern with smaller margins (1.7x faster at 30%, 11% faster at 60%, 8% slower at 90%, break-even at about 77%). With only three points per N, these are rough estimates.

The per-binding costs explain the crossover. Polled mode costs about 0.2 µs per binding at N=100 and 0.28 µs at N=1000 (its time divided by N). An effect run costs about 0.3 µs at N=100 and 0.36 µs at N=1000 (signal time divided by M). Signal mode saves the check on the N-M bindings that did not change, but pays more for each of the M that did. So the break-even is at M/N ≈ polled cost per binding / effect cost per run, which gives about 67% and 77%, in line with the interpolation. These costs are derived from timings rounded to one decimal, and the polled figure averages the DOM writes of the M changed bindings into every binding, so treat them as estimates.

#### What can't be attested so far
The tests cover independent bindings and bindings that share one signal, always with a single write at a time. They do not cover several writes per tick, setup costs, a realistic template or full correctness. Some limits to keep in mind:

- `polled mode` is a model of Angular's update block, not Angular itself. The reads match, but the times can't be compared, since Angular's include its scheduler.
- My `signal mode` runs its effects immediately and never batches them. Angular schedules a tick and batches writes, so several writes in one tick would cost it a single pass.
- The correctness check looks at the elements that depend on the written signal and at the others being unchanged, but it can't catch a binding that was wired to the wrong signal from the start.

## Conclusion
Signal-aware code generation does less work than the polled model when bindings read independent signals. Reads per write drop from N to the number of bindings that depend on the written signal, and the gap in time grows with N. It stops paying off when most of the bindings read the same signal: beyond roughly two thirds to three quarters of them, the per-binding effects cost more than the checks they replace. This suggests that per-binding granularity is not always the best choice. Grouping bindings that read the same set of signals into one effect would avoid the crossover, but I have not tested it. The limits listed above still apply: single writes, no batching, and a model of Angular's update block rather than Angular itself.

## Phase 2
The question for the next phase is whether the same transformation can be done inside Angular's own template compiler, and whether the generated code shows the same savings on Angular's runtime. The plan is to add a phase to the compiler's template pipeline that moves signal-reading interpolations out of the update block, together with a runtime instruction that updates them when the signal changes. I would then repeat the same scenarios (independent bindings, shared signal) and compare reads per write and time per write against the unmodified compiler.