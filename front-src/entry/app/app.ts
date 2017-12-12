import './app.scss';
let html: string = require('./app.html');
import { Page } from '../page'
import { startLoad } from '../game/game-asset';

export class App implements Page{
    elemList: Array<Element> = [];
    elem: Element;
    constructor(){
        let elemList: NodeListOf<Element> = document.querySelectorAll('app');
        for(let i = 0, len = elemList.length; i < len; i++){
            elemList[i].innerHTML = html;
            this.elemList.push(elemList[i]);
        }
        this.elem = this.elemList[0];
        this.initEvent();
    }
    initEvent(): void{
        $(this.elem.querySelector('.poster')).css({display: 'block'});
        
        this.elem.querySelector('.poster img').addEventListener('click', () => {
            this.startLoading();
            startLoad();
        });
    }
    startLoading():void{
        $(this.elem.querySelector('.poster')).css({display: 'none'});
        $(this.elem.querySelector('.loading')).css({display: 'block'});
    }
    hide(): void{
        this.elemList.forEach( (elem) => $(elem).css({display: 'none'}));
    }
    show(): void{
        this.elemList.forEach( (elem) => $(elem).css({display: 'block'}));
    }
}