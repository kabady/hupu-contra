import './orientLayer.scss';
let html: string = require('./orientLayer.html');
export class OrientationTip{
    elem: HTMLElement;
    constructor(){
        if(!document.querySelector('#orientLayer')){
            let a: HTMLElement = document.createElement('orientation-tip');
            a.innerHTML = html;
            this.elem = a
            document.querySelector('body').appendChild(a);
        }
    }
    hide(): void{
        $(this.elem).css({
            display: 'none'
        })
    }
}