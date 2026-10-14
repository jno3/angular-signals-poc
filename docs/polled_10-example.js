import { effect } from './runtime.js';

export function create(container, ctx) {
	const el1 = document.createElement('p');
	container.appendChild(el1);
	const text2 = document.createTextNode('');
	el1.appendChild(text2);
	const el3 = document.createElement('p');
	container.appendChild(el3);
	const text4 = document.createTextNode('');
	el3.appendChild(text4);
	const el5 = document.createElement('p');
	container.appendChild(el5);
	const text6 = document.createTextNode('');
	el5.appendChild(text6);
	const el7 = document.createElement('p');
	container.appendChild(el7);
	const text8 = document.createTextNode('');
	el7.appendChild(text8);
	const el9 = document.createElement('p');
	container.appendChild(el9);
	const text10 = document.createTextNode('');
	el9.appendChild(text10);
	const el11 = document.createElement('p');
	container.appendChild(el11);
	const text12 = document.createTextNode('');
	el11.appendChild(text12);
	const el13 = document.createElement('p');
	container.appendChild(el13);
	const text14 = document.createTextNode('');
	el13.appendChild(text14);
	const el15 = document.createElement('p');
	container.appendChild(el15);
	const text16 = document.createTextNode('');
	el15.appendChild(text16);
	const el17 = document.createElement('p');
	container.appendChild(el17);
	const text18 = document.createTextNode('');
	el17.appendChild(text18);
	const el19 = document.createElement('p');
	container.appendChild(el19);
	const text20 = document.createTextNode('');
	el19.appendChild(text20);
	return { text2, text4, text6, text8, text10, text12, text14, text16, text18, text20 };
}

export function update(refs, ctx) {
	refs.text2.textContent = `${ctx.s0()}`;
	refs.text4.textContent = `${ctx.s1()}`;
	refs.text6.textContent = `${ctx.s2()}`;
	refs.text8.textContent = `${ctx.s3()}`;
	refs.text10.textContent = `${ctx.s4()}`;
	refs.text12.textContent = `${ctx.s5()}`;
	refs.text14.textContent = `${ctx.s6()}`;
	refs.text16.textContent = `${ctx.s7()}`;
	refs.text18.textContent = `${ctx.s8()}`;
	refs.text20.textContent = `${ctx.s9()}`;
}
