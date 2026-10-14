import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <p>{{ s0() }}</p>
    <p>{{ s1() }}</p>
    <p>{{ s2() }}</p>
    <p>{{ s3() }}</p>
    <p>{{ s4() }}</p>
    <p>{{ s5() }}</p>
    <p>{{ s6() }}</p>
    <p>{{ s7() }}</p>
    <p>{{ s8() }}</p>
    <p>{{ s9() }}</p>
  `,
})
export class App {
  readonly s0 = signal(0);
  readonly s1 = signal(1);
  readonly s2 = signal(2);
  readonly s3 = signal(3);
  readonly s4 = signal(4);
  readonly s5 = signal(5);
  readonly s6 = signal(6);
  readonly s7 = signal(7);
  readonly s8 = signal(8);
  readonly s9 = signal(9);
}
