$(() => {
  require('fastclick').attach(document.body);
})
import './gameCtrl.scss';
import { Page } from '../../page';
let html: string = require('./gameCtrl.html');
export class GameCtrl implements Page{
  htmlContainer: HTMLElement;
  leftCtrl: HTMLElement;
  rightCtrl: HTMLElement;

  leftClickHandle: () => void = () => 0;
  rightClickHandle: () => void = () => 0;
  constructor(){
    let ctrlElem = document.createElement('game-ctrl');
    ctrlElem.innerHTML = html;
    this.htmlContainer = ctrlElem;
    document.querySelector('body').appendChild(ctrlElem);

    this.setCtrlElem();
    this.hide();
    console.log(111)
  }
  setCtrlElem(): void{
    this.leftCtrl = this.htmlContainer.querySelector('.left-ctrl')
    this.rightCtrl = this.htmlContainer.querySelector('.right-ctrl')
    
    this.leftCtrl.addEventListener('click', (ev) => this.leftClick(ev));
    this.rightCtrl.addEventListener('click', (ev) => this.rightClick(ev));
  }

  setLeftListener(clickListener: () => void){
    this.leftClickHandle = clickListener;
  }
  leftClick(ev: MouseEvent): void{
    this.leftClickHandle();
  }
  setRightListener(clickListener: () => void){
    this.rightClickHandle = clickListener;
  }
  rightClick(ev: MouseEvent): void{
    this.rightClickHandle();
  }
  show(): void{
    $(this.htmlContainer).css({ display: 'block'});
  }
  hide(): void{
    $(this.htmlContainer).css({ display: 'none'});
  }
}

export const gameCtrl = new GameCtrl();