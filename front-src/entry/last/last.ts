import './last.scss';
import { Page } from '../page';
import { gameCtrl } from '../game/gameCtrl/gameCtrl';
let html: string = require('./last.html');

export class LastPage implements Page {
  elemList: Array<Element> = [];
  gameElem: Element;
  constructor() {
    let gameElem: HTMLElement = document.createElement('last-page');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
    this.elemList.push(gameElem);
    this.gameElem = gameElem;
    this.initEvent();
  }
  initEvent(): void{
    this.gameElem.querySelector('.js-link').addEventListener('click', () => {
      let a = document.createElement('a');
      a.click();
    })
  }
  hide(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'none' }));
  }
  show(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'block' }));
    gameCtrl.hide();
  }
}