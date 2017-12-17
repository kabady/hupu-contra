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
import { assetMapQueue, gameOver } from './game-asset';
import { setTimeout } from 'timers';

const devicePixelRatio: number = window.devicePixelRatio;
export const showRatio: number = 568 / 320;
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
    // test
    if(num == Game.BOSS_LEVE_1)
      num = Game.BOSS_LEVE_3;
    // ------

    this.curGameState = num;
    this.player.scenceState = num;
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
  }
  scene2(){
    this.scenes = assetMapQueue.getResult('scenes2');
    this.boss.setState(Boss.LEVEL_2);

    this.player.run();
  }
  basketball: createjs.DisplayObject;
  scene3(){
    this.basketball = new createjs.Bitmap(assetMapQueue.getResult('backetball'));
    this.basketball.x = 600;
    this.basketball.y = 400;
    this.addScenceObject(this.basketball);
    this.scenes = assetMapQueue.getResult('scenes3');
    this.boss.setState(Boss.LEVEL_3);
    this.player.run();
    
  }
  hide(): void{
    this.elemList.forEach( (elem) => $(elem).css({display: 'none'}));
  }
  show(): void{
    this.elemList.forEach( (elem) => $(elem).css({display: 'block'}));
  }
  scenceRenderList: Array<createjs.DisplayObject> = [];
  addScenceObject(display: createjs.DisplayObject): void{
    // todo
    console.log('需要找到球在哪里？');
    this.stage.addChild(display);
    this.scenceRenderList.push(display);
  }
  nextScene(){
    let gameIsOver = false;
    while(this.scenceRenderList.length != 0){
      this.stage.removeChild(this.scenceRenderList.pop())
    }
    switch(this.curGameState){
      case Game.BOSS_LEVE_0:
      this.startBoss(Game.BOSS_LEVE_1);
      break;
      case Game.BOSS_LEVE_1:
      this.startBoss(Game.BOSS_LEVE_2);
      break;
      case Game.BOSS_LEVE_2:
      this.startBoss(Game.BOSS_LEVE_3);
      break;
      case Game.BOSS_LEVE_3:
        console.log('game is over')
        gameIsOver = true
      break;
    }
    if(gameIsOver){
      gameOver(this.stage);
      return;
    }
    this.player.enterNextScence(() => {
      this.playerEntered();
    });
  }
  playerEntered(): void{
    this.showMonologue(this.curGameState)
  }
  open(){
    if(this.curGameState == Game.BOSS_LEVE_3){
      setTimeout(() => {
        this.player.autoShoot()
      }, 2000);
    }
  }
  gameStartPlay(): void{
    this.gameCanplay = true;
    this.boss.startAutoShoot();
  }
  showMonologue(gameState: number): void{
    let waitTime = 0;
    let anyObj: any = null;
    switch(gameState){
      case Game.BOSS_LEVE_0:

      break;
      case Game.BOSS_LEVE_1:
      let gameMonologue = $('.game-monologue').css({display: 'block'})
      setTimeout(() => {anyObj = assetMapQueue.getResult('boss1Playerword1');gameMonologue.empty().append(anyObj)}, 1000 * 0)
      setTimeout(() => {anyObj = assetMapQueue.getResult('boss1Playerword2');gameMonologue.empty().append(anyObj)}, 1000 * 1)
      setTimeout(() => {anyObj = assetMapQueue.getResult('boss1Playerword3');gameMonologue.empty().append(anyObj)}, 1000 * 3)

      waitTime = 5000;
      break;
      case Game.BOSS_LEVE_2:
      anyObj = assetMapQueue.getResult('boss2Playerword1');
      $('.game-monologue').css({display: 'block'}).empty().append(anyObj);
      waitTime = 1500;
      break;
      case Game.BOSS_LEVE_3:
      anyObj = assetMapQueue.getResult('boss3Playerword1');
      $('.game-monologue').css({display: 'block'}).empty().append(anyObj);
      waitTime = 1500;
      break;
    }
    setTimeout(() => {
      $('.game-monologue').css({display: 'none'});
      this.gameStartPlay()
      this.open();
    }, waitTime);
  }
  initCreatejs(): void{
    this.showContainer_height = 850;
    this.showContainer_width = 1500;

    this.canvas.setAttribute('width', this.showContainer_width + '');
    this.canvas.setAttribute('height', (this.showContainer_width / showRatio) + '');

    this.stage = new createjs.Stage(this.canvas);
    
    this.boss.shot(this.player, () => {
      this.boss.hide();
      this.boss.closeAutoShoot();
    });
    this.player.shootSomeOne(this.boss, (bullet) => {
      this.player.closeAutoShoot();
      this.gameCanplay = false;
      bullet.destory();
      this.player.runToNextScene(() => {
        this.nextScene();
      });
    });
    this.player.shot(this.boss, () => {
      this.player.dying();
    })
    this.boss.shootSomeOne(this.player, (bullet) => {
      bullet.over();
    })
    this.gameCtrl.setLeftListener( () => {
      if(this.gameCanplay){
        if(this.curGameState == Boss.LEVEL_3){
          this.player.leftRun()
        }else{
          this.player.jump()
        }
      }
    })
    this.gameCtrl.setRightListener( () => {
      if(this.gameCanplay){
        if(this.curGameState == Boss.LEVEL_3){
          this.player.rightRun()
        }else{
          this.player.shoot()
        }
      }
    });

    createjs.Ticker.addEventListener("tick", (e) => {
      try{
        this.createjsTicker(e)
      }
      catch(e){
        console.error('ticker loop error');
      }
    });
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
    if(!this.gameCanplay){
      return;
    }
    let playerShot = false;
    this.player.bullets.forEach((bullet) => {
      if(bullet.displayObject && this.boss.curDisplay && checkPixelCollision(bullet.displayObject, this.boss.curDisplay)){
        // 击中目标
        this.player.hasShot(this.boss, bullet);
        this.boss.hasBeenShot(this.player, bullet);
        playerShot = true;
      }
    })
    if(playerShot == false && this.player.isAlive == true && this.player.isGodPlayer == false){
      this.boss.bullets.forEach( bullet => {
        if(bullet.displayObject && this.player.curDisplay && checkPixelCollision(bullet.displayObject, this.player.curDisplay)){
          // 击中目标
          this.boss.hasShot(this.player, bullet);
          this.player.hasBeenShot(this.boss, bullet);
        }
      })
    }
  }
  GameOver(stage): void{
    createjs.Ticker.removeAllEventListeners('tick');
  }
}
export interface NextFrameRunTime{
  nextFrameRunList: Array<()=>void>;
  nextFrameRun(): void;
  setNextFrameRun(handle: ()=> void): void;
}