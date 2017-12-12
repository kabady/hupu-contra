import './game.scss';
let html: string = require('./game.html');
let game: Game = null;

import { Page } from '../page'
import 'Zepto'
import 'ndgmr';

const _window: any = window;
const checkRectCollision = _window.ndgmr.checkRectCollision;
const checkPixelCollision = _window.ndgmr.checkPixelCollision;


import { Player } from './game-object/player';
import { Boss } from './game-object/boss';
import { GameCtrl } from './gameCtrl';
import { Bullet } from './game-object/bullet';
import { assetMapQueue } from './game-asset';

const devicePixelRatio: number = window.devicePixelRatio;
const showRatio: number = 568 / 320;
export class Game implements Page{
  static BOSS_LEVE_0 = 0;
  static BOSS_LEVE_1 = 1;
  static BOSS_LEVE_2 = 2;
  static BOSS_LEVE_3 = 3;
  elemList: Array<Element> = [];
  canvas: Element;
  stage: createjs.Stage;
  showContainer_height: number;
  showContainer_width: number;
  player: Player = new Player();
  boss: Boss = new Boss();
  gameCtrl: GameCtrl = new GameCtrl();
  bullets: Array<Bullet> = [];
  scenes: any;
  curGameState: number;
  gameCanplay = false;
  constructor(){
    if(game)
      return game
    
    let gameElem: HTMLElement = document.createElement('game');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
    this.elemList.push(gameElem);
    this.canvas = gameElem.querySelector('#canvas');
    this.gameCtrl.setCtrlContainer(gameElem.querySelector('.ctrl-container'));
    this.startBoss(Game.BOSS_LEVE_0);
    
    this.initCreatejs();
  }
  startBoss(num: number){
    this.curGameState = num;
    switch(num){
      case Game.BOSS_LEVE_0:
        this.scene0();
      break;
      case Game.BOSS_LEVE_1:
        this.scene1();
      break;
      case Game.BOSS_LEVE_2:
        this.scene2();
      break;
      case Game.BOSS_LEVE_3: 
        this.scene3();
      break;
    }
    this.scenes.className = 'bg'
    this.elemList[0].querySelector('.canvas-container').replaceChild(this.scenes, this.elemList[0].querySelector('.bg'));
  }
  scene0(){
    this.scenes = assetMapQueue.getResult('scenes0');
    this.boss.setState(Boss.LEVEL_0);

    this.player.stand();
    this.gameCanplay = true;
  }
  scene1(){
    this.scenes = assetMapQueue.getResult('scenes1');
    this.boss.setState(Boss.LEVEL_1);

    this.player.run();
    this.gameCanplay = true;
  }
  scene2(){
    this.scenes = assetMapQueue.getResult('scenes2');
    this.boss.setState(Boss.LEVEL_0);

    this.player.stand();
    this.gameCanplay = true;
  }
  scene3(){
    this.scenes = assetMapQueue.getResult('scenes3');
    this.boss.setState(Boss.LEVEL_0);

    this.player.stand();
    this.gameCanplay = true;
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
    
    this.boss.shot(this.player, () => {
      console.log('i has been shot by the player');
      this.boss.hide();
    });
    this.player.shootSomeOne(this.boss, (bullet) => {
      console.log('player: I shot the boss');
      this.gameCanplay = false;
      bullet.destory();
      this.player.runToNextScene(() => {
        this.startBoss(Game.BOSS_LEVE_1);
        this.boss.setState(Boss.LEVEL_1);
        console.log(this.boss.curDisplay)
        this.player.enterNextScence()
      });
    });

    this.gameCtrl.setLeftListener( () => {
      if(this.gameCanplay){
        console.log('i want to jamp');
      }
    })
    this.gameCtrl.setRightListener( () => {
      if(this.gameCanplay){
        this.player.shoot()
      }
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
    this.player.bullets.forEach((bullet) => {
      if(checkRectCollision(bullet.displayObject, this.boss.curDisplay)){
        // 击中目标
        this.player.hasShot(this.boss, bullet);
        this.boss.hasBeenShot(this.player, bullet);
      }
    })
  }
}
export interface NextFrameRunTime{
  nextFrameRunList: Array<()=>void>;
  nextFrameRun(): void;
  setNextFrameRun(handle: ()=> void): void;
}