# angular-signals-poc

## A little study regarding angular signals, how they work and what could be done to improve them

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

Well, a method being called inside the update block, like `ɵɵtextInterpolate1("Hello, ", ctx.name());` runs every time the block runs, and Angular knows nothing about what it reads, it can only find whether the result change by calling it and comparing it with the stored value through the method `bindingUpdated` that is called indirectly inside `ɵɵtextInterpolate1`. The chain goes as `ctx.name (value may or may not have changed) -> ɵɵtextInterpolate1 -> interpolation1 -> bindingUpdated`, So:


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

Inside the scripts directory, I have two scripts for helping me create and analyze the file with my OCaml AST interpreter. [gen_scenario.ts](resources/scripts/gen_scenario.ts) that takes an argument N and creates an angular application with N signals inside my dummy Angular component [app.ts](resources/codegen-poc/src/app/app.ts) and [analyzer.ts](resources/scripts/analyzer.ts) that reads said file and generates `ctx.js`, the context for my faux-angular and the `ast.json` that is read by my OCaml and, since I'm working from the template out and, inside a template, a method and a signal call don't really differ (`{{ call() }}`), analyzer gets all signals explicitly and writes a `signals.json` that is also read by my OCaml application. If I pass the flag `-s` when executing my OCaml app, the signals noted in the json file are ignored and treated all as if they were methods, otherwise they get treated as signals. So I'll call these different modes as `signal mode` and `polled mode`.

And to answer the question posed in this subsection, my idea for making signals more granular would be relying more on individual updates instead of updating a whole block for a single signal change. I did that inside the [runtime.js](resources/page/runtime.js) file that contains a new definition for method `signal`, a producer, a method that holds a value (initial signal value) and holds a set of subscribers. So instead of emitting the interpolation inside the update block, I wrap it in an `effect` created once in the `create` block. `effect` is the consumer that detects the changes in the `signal` it is attached to and updates the text content of the HTML piece that is directly affected.

### runtime.js
`runtime.js` is what keeps the experiment controlled for both modes - later when I'm testing my experiment, the methods called inside interpolation will be interpreted as methods or as signals depending on the `-s` flag, regardless, both will use `runtime.js`.

Defined inside it there are two exported functions:

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
This will generate [ctx.js](docs/ctx-example.js), [ast.json](docs/ast-generated-example.json) and [signals.json](docs/signals-example.json). The AST interpreter, as described before, will use the generated `ast.json` and transform it into a js file. The way it interprets the calls from inside the interpolations will depend entirely of the `-s` flag. So, running the command OCaml application as:

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
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 20, vars: 10, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "p");
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "p");
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "p");
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "p");
      \u0275\u0275text(7);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "p");
      \u0275\u0275text(9);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "p");
      \u0275\u0275text(11);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "p");
      \u0275\u0275text(13);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(14, "p");
      \u0275\u0275text(15);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(16, "p");
      \u0275\u0275text(17);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(18, "p");
      \u0275\u0275text(19);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.s0());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s1());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s2());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s3());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s4());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s5());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s6());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s7());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s8());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.s9());
    }
  }, encapsulation: 2 });
};
```

</details>

<br>

#### bench.html

To test these files we'll use the [bench.html](/resources/page/bench.html) file that will import the `stats` from `runtime.js` and `ctx` from the generated `ctx.js`. It takes two arguments, `page` to point which generated js file we'll be testing (like `?page=polled`) and optional parameters `write` to select a signal for writing onto (like `&write=s0`) and `writes` that sets how many writes to time (like `&writes=1000`). The number of `rounds` is fixed to 5.

It wraps every `signal` in `ctx` with a read counter. Each wrapper does `reads++` right before calling the real `signal`, so we can keep track and still use the `signal`.

Then it imports the generated page and calls `create(app, ctx)` and `update(refs, ctx)`. That is the first render. After that it does two separate things:

1. **Single-write measurement.** It resets `reads`, runs `ctx[target].set(999999)` and then `update(refs, ctx)`. This gives us `reads/write` and `effect runs/write`. It then checks for correctness: the first `<p>` must show `999999`.
2. **Timing.** It runs 5 rounds, and each round does `writes` cycles of `set` with a new value followed by `update`. A round is one timed batch. We repeat it to get rid of noise and report the median. Every write uses a different value because a signal ignores a `set` with the value it already has.
<br>
The results outputed are:

| Result | What it means |
|--------|---------------|
| reads/write | The amount of times a read happened for a single write |
| effect runs/write | The amount of times an `effect` was run for a single write |
| median of 5 rounds x writes | The median time over 5 rounds for executing the amount of `writes` | 
| correct | Whether the first `<p>` shows the written value |


#### Results
For generating the test files, I ran the following commands:
```bash
npx tsx resources/scripts/gen_scenario.ts N
npx tsx resources/scripts/analyzer.ts
dune exec ast-to-js -- -o signal_N
dune exec ast-to-js -- -o polled_N -s
```
And ran my `bench.html` tests for each N before generating the next N signals and so on.

These were the results attained:

| N | Mode | reads/write | effect runs/write | median time (ms) | correct |
|---|------|-------------|-------------------|------------------|---------|
| 10 | polled | 10 | 0 | 1.5 | true |
| 10 | signal | 1 | 1 | 0.9 | true |
| 100 | polled | 100 | 0 | 20.3 | true |
| 100 | signal | 1 | 1 | 0.8 | true |
| 1000 | polled | 1000 | 0 | 211.3 | true |
| 1000 | signal | 1 | 1 | 0.8 | true |

#### Testing it against proper angular
For the Angular setup we generate the same template with `--counted`:
```bash
npx tsx resources/scripts/gen_scenario.ts 10 --counted
```
This version wraps every signal with a read counter and adds two buttons. One counts the reads for a single write, the other times the writes. It has to be generated last, because the analyzer cannot read it.
