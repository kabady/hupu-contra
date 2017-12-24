
const ctrlBackground = {
  leftRun: require('../../../_assets/game-ctrl-l.png'),
  rightRun: require('../../../_assets/game-ctrl-r.png'),
  shoot: require('../../../_assets/game-ctrl-s.png'),
  jump: require('../../../_assets/game-ctrl-u.png'),
}
import './gameCtrl.scss';
import { Page } from '../../page';
let html: string = require('./gameCtrl.html');
export class GameCtrl implements Page{
  static CTRL_BTN_TYPE_LEFTRUN = 'CTRL_BTN_TYPE_LEFTRUN';
  static CTRL_BTN_TYPE_RIGHTRUN = 'CTRL_BTN_TYPE_RIGHTRUN';
  static CTRL_BTN_TYPE_SHOOT = 'CTRL_BTN_TYPE_SHOOT';
  static CTRL_BTN_TYPE_JUMP = 'CTRL_BTN_TYPE_JUMP';

  htmlContainer: HTMLElement;
  leftCtrl: HTMLElement;
  rightCtrl: HTMLElement;

  leftClickHandle: () => void = () => 0;
  rightClickHandle: () => void = () => 0;

  leftClickHandleList: Array<()=>void> = [];
  rightClickHandleList: Array<()=>void> = [];
  constructor(){
    let ctrlElem = document.createElement('game-ctrl');
    ctrlElem.innerHTML = html;
    this.htmlContainer = ctrlElem;
    document.querySelector('body').appendChild(ctrlElem);

    this.initCtrlElem();
    this.hide();
  }
  setLeftBtnType(type: string): void{
    this.setBtnsType(type, this.leftCtrl);
  }
  setRightBtnType(type: string): void{
    this.setBtnsType(type, this.rightCtrl);
  }
  setBtnsType(type: string, btnElem: Element):void{
    switch(type){
      case GameCtrl.CTRL_BTN_TYPE_JUMP:
        $(btnElem).css({backgroundImage: `url(${ctrlBackground.jump})`, backgroundSize: '100% 100%'})
      break;
      case GameCtrl.CTRL_BTN_TYPE_SHOOT:
        $(btnElem).css({backgroundImage: `url(${ctrlBackground.shoot})`, backgroundSize: '70% 70%'})
      break;
      case GameCtrl.CTRL_BTN_TYPE_LEFTRUN:
        $(btnElem).css({backgroundImage: `url(${ctrlBackground.leftRun})`, backgroundSize: '100% 100%'})
      break;
      case GameCtrl.CTRL_BTN_TYPE_RIGHTRUN:
        $(btnElem).css({backgroundImage: `url(${ctrlBackground.rightRun})`, backgroundSize: '100% 100%'})
      break;
    }
  }
  initCtrlElem(): void{
    this.leftCtrl = this.htmlContainer.querySelector('.left-ctrl')
    this.rightCtrl = this.htmlContainer.querySelector('.right-ctrl')
    
    this.leftCtrl.addEventListener('click', (ev) => this.leftClick(ev));
    this.rightCtrl.addEventListener('click', (ev) => this.rightClick(ev));
  }
  // 过期
  // 使用请使用initCtrlElem
  setCtrlElem(): void{
    this.leftCtrl = this.htmlContainer.querySelector('.left-ctrl')
    this.rightCtrl = this.htmlContainer.querySelector('.right-ctrl')
    
    this.leftCtrl.addEventListener('click', (ev) => this.leftClick(ev));
    this.rightCtrl.addEventListener('click', (ev) => this.rightClick(ev));
  }

  setLeftListener(clickListener: () => void): number{
    // this.leftClickHandle = clickListener;
    this.leftClickHandleList.push(clickListener);
    return this.leftClickHandleList.length - 1;
  }
  setRightListener(clickListener: () => void): number{
    // this.rightClickHandle = clickListener;
    this.rightClickHandleList.push(clickListener);
    return this.rightClickHandleList.length - 1;
  }
  removeLeftHandle(num: number): void{
    this.leftClickHandleList[num] = undefined;
  }
  removeRightHandle(num: number): void{
    this.rightClickHandleList[num] = undefined;
  }
  leftClick(ev: MouseEvent): void{
    this.leftClickHandleList.forEach(handle => handle && handle() );
    // this.leftClickHandle();
  }
  rightClick(ev: MouseEvent): void{
    this.rightClickHandleList.forEach(handle => handle && handle() );
    // this.rightClickHandle();
  }
  show(): void{
    $(this.htmlContainer).css({ display: 'block'});
  }
  hide(): void{
    $(this.htmlContainer).css({ display: 'none'});
  }
  leftClickBtnFloat(): void{
    $(this.leftCtrl).css({zIndex: 12})
  }
  rightClickBtnFloat(): void{
    $(this.rightCtrl).css({zIndex: 12})
  }
  hideLeftBtn(): void{
    $(this.leftCtrl).hide();
  }
  showLeftBtn(): void{
    $(this.leftCtrl).show();
  }
  hideRightBtn(): void{
    $(this.rightCtrl).hide();
  }
  showRightBtn(): void{
    $(this.rightCtrl).show();
  }
}

export const gameCtrl = new GameCtrl();