import './last.scss';
import { Page } from '../page';
let html: string = require('./last.html');

export class LastPage implements Page {
  elemList: Array<Element> = [];
  constructor() {
    let gameElem: HTMLElement = document.createElement('last-page');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
  }
  hide(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'none' }));
  }
  show(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'block' }));
  }
}