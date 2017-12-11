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
import { Boss } from './boss';
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
  boss: Boss = new Boss();
  gameCtrl: GameCtrl = new GameCtrl();
  bullets: Array<createjs.DisplayObject> = [];
  constructor(){
    if(game)
      return game
    
    let gameElem: HTMLElement = document.createElement('game');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
    this.elemList.push(gameElem);
    this.canvas = gameElem.querySelector('#canvas');
    this.gameCtrl.setCtrlContainer(gameElem.querySelector('.ctrl-container'));
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

    this.boss.setState(this.boss.STATE_BOSS_NO_ONE);
    this.boss.shot(this.player, () => {
      console.log('boss: The player has shot me');
    })
    this.player.shootSomeOne(this.boss, () => {
      console.log('player: I shot the boss');
    });

    this.player.run();
    this.gameCtrl.setRighttListener(() => {
      // this.player.shoot();
      this.player.shoot((bullets) => {
        this.bullets = this.bullets.concat(bullets);
        console.log(this.bullets)
      })
    });

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

    this.boss.removeList.forEach((removeObject) => {
      this.stage.removeChild(removeObject);
      this.boss.clearRemoveCache();
    })
    this.boss.renderList.forEach((renderObject, i) => {
      this.stage.addChild(renderObject);
      this.boss.clearRenderCache();
    });
    // console.log(11, this.bullets)
    this.stage.update();
    this.player.nextFrameRun();
    // 碰撞检测
    checkRectCollision
    
  }
}