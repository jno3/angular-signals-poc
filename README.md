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
Now that we know that our AST interpreter has two modes, `polled mode` and `signal mode`. The former treating the calls inside interpolations as methods and the latter treating them as "our signal" tracked with `effect`, we need to generate test cases to infer what sort of improvement could be brought to the table by using the `signal mode`.

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

I get the [polled_10.js](docs/polled_10-example.js) file. The one that sort of replicates how an



#### Decoding
