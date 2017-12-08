import './app.scss';
let html: string = require('./app.html');
import { Page } from '../page'

export class App implements Page{
    elemList: Array<Element> = [];
    constructor(){
        let elemList: NodeListOf<Element> = document.querySelectorAll('app');
        for(let i = 0, len = elemList.length; i < len; i++){
            elemList[i].innerHTML = html;
            this.elemList.push(elemList[i]);
        }
    }
    hide(): void{
        this.elemList.forEach( (elem) => $(elem).css({display: 'none'}));
    }
    show(): void{
        this.elemList.forEach( (elem) => $(elem).css({display: 'block'}));
    }
}