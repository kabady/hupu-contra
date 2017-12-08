let _window: any = window;
let _document: any = document;
_window.onresize = RemInit;

export function RemInit(): void{
	let c: HTMLElement = _document.getElementsByTagName('html')[0];
	let b: number = c.clientWidth;
	c.style.fontSize = b/20/16*100+'px';
}
