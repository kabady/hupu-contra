import './gameTeach.scss';
let html = require('./gameTeach.html');

import { Page } from "../../page";
import { gameCtrl } from '../gameCtrl/gameCtrl';
import { Boss } from '../game-object/boss';
import { setTimeout } from 'timers';
gameCtrl
export class GameTeach implements Page {
  elem: Element;
  titleElem: Element;

  boss: Boss;
  teachOverHandle: () => void;
  constructor() {
    let elem = document.createElement('game-teach');
    elem.innerHTML = html;
    document.querySelector('body').appendChild(elem);
    elem = elem.querySelector('.game-teach');
    this.titleElem = elem.querySelector('.teach-title');
    this.elem = elem;
    this.teachOverHandle = () => 0;
  }
  teachJump(): void{
    this.pushTitle('关卡需要按下跳跃键躲避攻击');
    setTimeout(() => {
      this.pushTitle('在空中按跳跃键实现双跳');
      $(this.elem).css({zIndex: 1});
      gameCtrl.showLeftBtn();
      let leftClickNum = gameCtrl.setLeftListener(() => {
        gameCtrl.removeLeftHandle(leftClickNum);
        this.teachShoot();
      })
    }, 2000)
  }
  teachShoot(): void{
    this.pushTitle('按下射击键发射子弹');
    gameCtrl.showRightBtn();
    let rightClickNum = gameCtrl.setRightListener( () => {
      this.over();
      gameCtrl.removeRightHandle(rightClickNum);
    })
  }
  pushTitle(title: string): void{
    this.elem.appendChild($(`<p class="teach-title">${title}</p>`)[0])
  }
  setTitle(title: string): void{
    $(this.titleElem).text(title);
  }
  start(boss: Boss){
    gameCtrl.hideLeftBtn();
    gameCtrl.hideRightBtn();
    this.boss = boss;
    this.show();

    setTimeout(() => {
      this.teachJump();
    }, 1000);
  }
  over(): void{
    this.hide();
    $(this.elem).remove();
  }
  subscribe(handle){
    this.teachOverHandle = handle;
  }
  show():void{
    $(this.elem).show();
  }
  hide(): void{
    $(this.elem).hide();
  }
}