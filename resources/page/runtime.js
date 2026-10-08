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