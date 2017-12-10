import './game.scss';
let html: string = require('./game.html');
let game: Game = null;

import { Page } from '../page'
import 'Zepto'
import 'ndgmr';

const _window: any = window;
const checkRectCollision = _window.ndgmr.checkRectCollision;
const checkPixelCollision = _window.ndgmr.checkPixelCollision;


import { Player } from './player';
import { GameCtrl } from './gameCtrl';

const devicePixelRatio: number = window.devicePixelRatio;
const showRatio: number = 568 / 320;
export class Game implements Page{
  elemList: Array<Element> = [];
  canvas: Element;
  stage: createjs.Stage;
  showContainer_height: number;
  showContainer_width: number;
  player: Player = new Player();
  gameCtrl: GameCtrl = new GameCtrl();
  constructor(){
    if(game)
      return game
    
    let gameElem: HTMLElement = document.createElement('game');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
    this.elemList.push(gameElem);
    this.canvas = gameElem.querySelector('#canvas');
    this.initCreatejs();
  }
  hide(): void{
    this.elemList.forEach( (elem) => $(elem).css({display: 'none'}));
  }
  show(): void{
    this.elemList.forEach( (elem) => $(elem).css({display: 'block'}));
  }
  initCreatejs(): void{
    this.showContainer_height = 850;
    this.showContainer_width = 1500;

    this.canvas.setAttribute('width', this.showContainer_width + '');
    this.canvas.setAttribute('height', (this.showContainer_width / showRatio) + '');

    this.stage = new createjs.Stage(this.canvas);
    
    this.player.decease();
    createjs.Ticker.addEventListener("tick", (e) => this.createjsTicker(e));
    // createjs.Ticker.setFPS(10); //Deprecated
    createjs.Ticker.framerate = 30;
  }
  createjsTicker(e: Object): void{
    this.player.removeList.forEach((removeObject) => {
      this.stage.removeChild(removeObject);
      this.player.clearRemoveCache();
    })
    this.player.renderList.forEach((renderObject, i) => {
      this.stage.addChild(renderObject);
      this.player.clearRenderCache();
    });

    this.stage.update();
    // 碰撞检测
    checkRectCollision
    
  }
}