import { CanShoot, ShootRelative } from "../canShoot";
import { CanShot } from "../canShot";
import { Bullet } from "./bullet";
import { NextFrameRunTime, Game } from "../game";
import { assetMapQueue } from "../game-asset";

export class Player implements CanShoot, NextFrameRunTime, CanShot {
  el: createjs.DisplayObject;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  playerRun: createjs.DisplayObject;
  playerStand: createjs.DisplayObject;
  playerStand2: createjs.DisplayObject;
  playerDecease: createjs.DisplayObject;
  playerShooting: createjs.DisplayObject;
  playerStandAnimate: createjs.DisplayObject;
  playerjump: createjs.DisplayObject;
  playerLeftRun: createjs.DisplayObject;
  playerRightRun: createjs.DisplayObject;
  playerDecease2: createjs.DisplayObject;
  state: string = '';

  curDisplay: createjs.DisplayObject;
  bullets: Array<Bullet> = [];

  playerSheet: createjs.SpriteSheet;
  isAlive = true;
  constructor() {
    //创建一个显示对象
    this.playerSheet = new createjs.SpriteSheet({
      framerate: 30,
      images: [assetMapQueue.getResult('hero')],
      frames: { regX: 0, regY: 0, height: 250, width: 400, count: 30 },
      // define two animations, run (loops, 1.5x speed) and jump (returns to run):
      animations: {
        run: { frames: [2, 3], speed: .12 },
        stand: { frames: [0] },
        stand2: { frames: [1] },
        lfRun: { frames: [6, 7], speed: .12 },
        rfRun: { frames: [4, 5], speed: .12 },
        jump: { frames: [9, 10, 11, 12], speed: .2 },
        decease: { frames: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], speed: .8, next: 'down' },
        down: {
          frames: [25, 26],
          speed: .1
        },
        decease2: { frames: [27, 28], speed: .2 },
        standAnimate: {
          frames: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14],
          speed: 1.4, next: 'stand'
        }
      }
    });

    this.playerRun = new createjs.Sprite(this.playerSheet, "run");
    this.playerStand = new createjs.Sprite(this.playerSheet, "stand");
    this.playerDecease = new createjs.Sprite(this.playerSheet, "decease");
    this.playerShooting = new createjs.Sprite(this.playerSheet, "stand");
    this.playerStandAnimate = new createjs.Sprite(this.playerSheet, "standAnimate");
    this.playerjump = new createjs.Sprite(this.playerSheet, "jump");
    this.playerLeftRun = new createjs.Sprite(this.playerSheet, "lfRun");
    this.playerRightRun = new createjs.Sprite(this.playerSheet, "rfRun");

    this.playerStand2 = new createjs.Sprite(this.playerSheet, "stand2");
    this.playerDecease2 = new createjs.Sprite(this.playerSheet, "decease2");
    this.setXY(200, 450);
  }
  /**
   * 中单也不是死亡
   * 但是不能发射子弹
   * 
   * @type {false}
   * @memberof Player
   */
  isGodPlayer = false;
  /**
   * 中单也不是死亡
   * 但是不能发射子弹
   * 
   * @memberof Player
   */
  openGod(): void{
    this.isGodPlayer = true;
    this.curDisplay.alpha  = .6;
    setTimeout(() => {
      this.closeGod();
    }, 2000);
  }
  closeGod():void{
    this.isGodPlayer = false;
    this.curDisplay.alpha  = 1;
  }
  x: number;
  y: number;
  setXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.playerjump.x = this.playerRun.x = this.playerStand.x = this.playerDecease.x = this.playerShooting.x = this.playerStandAnimate.x = x;
    this.playerjump.y = this.playerRun.y = this.playerStand.y = this.playerDecease.y = this.playerShooting.y = this.playerStandAnimate.y = y;
  }
  clearState(): void {
    this.removeList.push(this.playerRun);
    this.removeList.push(this.playerStand);
    this.removeList.push(this.playerDecease);
  }
  standAnimate() {
    this.state = 'standAnimate';
    let playerStandAnimate = new createjs.Sprite(this.playerSheet, "standAnimate");
    playerStandAnimate.x = this.playerStandAnimate.x;
    playerStandAnimate.y = this.playerStandAnimate.y;
    this.playerStandAnimate = playerStandAnimate;
    this.curDisplay = this.playerStandAnimate;
    this.clearStateExpect(this.playerStandAnimate);
    this.renderList.push(this.playerStandAnimate);
    playerStandAnimate.addEventListener('animationend', ()=> {
      this.stand();
    })
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void {
    if (expectObject !== this.playerRun) {
      this.removeList.push(this.playerRun);
    }
    if (expectObject !== this.playerStand) {
      this.removeList.push(this.playerStand);
    }
    if (expectObject !== this.playerDecease) {
      this.removeList.push(this.playerDecease);
    }
    if (expectObject !== this.playerShooting) {
      this.removeList.push(this.playerShooting);
    }
    if (expectObject !== this.playerStandAnimate) {
      this.removeList.push(this.playerStandAnimate);
    }
    if (expectObject !== this.playerjump) {
      this.removeList.push(this.playerjump);
    }
    if (expectObject !== this.playerStand2) {
      this.removeList.push(this.playerStand2);
    }
    if (expectObject !== this.playerLeftRun) {
      this.removeList.push(this.playerLeftRun);
    }
    if (expectObject !== this.playerRightRun) {
      this.removeList.push(this.playerRightRun);
    }
    if (expectObject !== this.playerDecease2) {
      this.removeList.push(this.playerDecease2);
    }
  }
  run(): void {
    this.state = 'run';
    this.curDisplay = this.playerRun;
    this.clearStateExpect(this.playerRun);
    this.renderList.push(this.playerRun);
  }
  runToNextScene(handle: () => void): void {
    this.run();
    createjs.Tween.get(this.curDisplay)
      .wait(100)
      // from x: 200
      .to({ x: 1800 }, 4000)
      .call(() => handle());
  }
  scenceState: number;
  enterNextScence(handle: () => void): void {
    if(this.scenceState == Game.BOSS_LEVE_3){
      this.setXY(450, 550);
      createjs.Tween.get(this.curDisplay)
        .to({ x: -200 }, 0)
        .to({ x: this.x }, 2000)
        .call(() => this.enterNextScenceOver(() => {
          this.stand2();
          handle();
        }));
    }else{
      this.setXY(200, 550);
      createjs.Tween.get(this.curDisplay)
        .to({ x: -200 }, 0)
        .to({ x: 200 }, 1000)
        .call(() => this.enterNextScenceOver(handle));
    }
    
  }
  enterNextScenceOver(handle: ()=> void): void {
    this.stand();
    handle();
    console.log('i has entered');
  }
  stand(): void {
    if(this.scenceState == Game.BOSS_LEVE_3){
      return;
    }
    this.state = 'stand';
    this.curDisplay = this.playerStand;
    this.clearStateExpect(this.curDisplay);
    this.renderList.push(this.curDisplay);
  }
  stand2(x?: number, y?: number): void{
    this.state = 'stand';
    this.curDisplay = this.playerStand2
    this.playerStand2.x = x || 580;
    this.playerStand2.y = y || 550;
    this.clearStateExpect(this.curDisplay);
    this.renderList.push(this.curDisplay);
  }
  jumpAnimate: createjs.Tween;
  jumpNumber: number = 0;
  jump(): void {
    if(this.state != 'stand' && this.state != 'jump'){
      return;
    }
    if(this.jumpNumber == 0){
      this.state = 'jump';
      this.curDisplay = this.playerjump;
      this.clearStateExpect(this.curDisplay);
      this.renderList.push(this.curDisplay);
      this.jumpAnimate = createjs.Tween.get(this.curDisplay)
      .to({y: this.y * .6 }, 400, createjs.Ease.sineOut)
      .to({y: this.y * 1 }, 400, createjs.Ease.sineIn)
      .call(() => {
        this.stand();
        this.jumpNumber = 0;
      })
    }else if(this.jumpNumber == 1){
      this.jumpAnimate.setPaused(true);
      this.jumpAnimate = createjs.Tween.get(this.curDisplay)
      .to({y: this.curDisplay.y * .4 }, 400, createjs.Ease.sineOut)
      .to({y: this.y * 1 }, 400, createjs.Ease.sineIn)
      .call(() => {
        this.jumpNumber = 0;
        this.stand();
      })
    }
    this.jumpNumber++;
  }

  decease(): void {

    this.state = 'decease';
    let playerDecease = new createjs.Sprite(this.playerSheet, "decease");
    playerDecease.x = this.playerDecease.x;
    playerDecease.y = this.playerDecease.y;
    this.playerDecease = playerDecease;
    this.curDisplay = this.playerDecease;
    this.clearStateExpect(this.playerDecease);
    this.renderList.push(this.playerDecease);
  }
  decease2(): void {
    this.state = 'decease';
    this.playerDecease2.x = this.curDisplay.x;
    this.playerDecease2.y = this.curDisplay.y;
    this.curDisplay = this.playerDecease2;
    this.clearStateExpect(this.curDisplay);
    this.renderList.push(this.curDisplay);
  }
  theAnimate: Array<() => void> = [];
  shootRelative: Array<ShootRelative> = [];
  shootSomeOne(who: CanShot, handle: (bullet: Bullet) => void): void {
    this.shootRelative.push({
      from: this,
      to: who,
      handle: handle
    })
  }
  hasShot(who: CanShot, bullet: Bullet): void {
    this.shootRelative.forEach((shootRelative) => {
      if (shootRelative.to == who && shootRelative.from == this) {
        shootRelative.handle(bullet);
      }
    })
  }
  removeBullet(bullet: Bullet): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i] == bullet)
        this.removeList.push(this.bullets.splice(i, 1)[0].displayObject);
    }
  }
  shoot(): void {
    if(!(this.state == 'shoot' || this.state == 'stand' || this.state == 'jump')){
      return;
    }
    if(this.isGodPlayer == true){
      return
    }
    if(this.isAlive == false){
      return;
    }
    this.state = 'shoot';

    this.setNextFrameRun(() => {
      let bounds: createjs.Rectangle = this.curDisplay.getBounds();
      if (bounds == null) {
        throw new Error('no bounds');
      } else {
        let base_x: number = this.curDisplay.x;
        let base_y: number = this.curDisplay.y;
        let bullets: Array<Bullet> = [];
        for (let i = 0, len = 1; i < len; i++) {
          let bullet: Bullet = new Bullet();
          bullet.setFrom(this);
          bullets.push(bullet);
          
          if(this.scenceState == Game.BOSS_LEVE_3){
            bullet.setStart(base_x + bounds.x + bounds.width * .5, base_y + bounds.y + bounds.height * 0);
            bullet.setEnd(base_x + bounds.x + bounds.width * .5, -20);
          }else{
            bullet.setStart(base_x + bounds.x + bounds.width * .9, base_y + bounds.y + bounds.height * .33);
          }
          // bullet.setEnd(bullet.x, 10); // test debug
          
          this.renderList.push(bullet.displayObject);
          bullet.setOver(() => this.removeList.push(bullet.displayObject));
          bullet.launch();
        }
        this.bullets = this.bullets.concat(bullets);
      }
    });
  }
  nextFrameRunList: Array<() => void> = [];
  nextFrameRun(): void {
    for (let i = 0, len = this.nextFrameRunList.length; i < len; i++) {
      try {
        this.nextFrameRunList[i]();
        this.nextFrameRunList.splice(i, 1);
      } catch (e) {

      }
    }
  }

  setNextFrameRun(handle: () => void): void {
    this.nextFrameRunList.push(handle);
  }
  removeRenderCache(index: number) {
    this.renderList.splice(index, 1);
  }
  clearRenderCache(): void {
    this.renderList = [];
  }
  clearRemoveCache(): void {
    this.removeList = [];
  }
  /**
    * 被shooter射击到了，做什么（handle）
    * 
    * @param {CanShoot} shooter 
    * @param {() => void} handle 
    * @memberof CanShot
    */
  shot(shooter: CanShoot, handle: () => void): void {
    this.shootRelative.push({
      from: shooter,
      to: this,
      handle: handle
    })
  }
  /**
   * 已经被WHO击中了
   * 
   * @param {CanShoot} who 
   * @memberof CanShot
   */
  hasBeenShot(who: CanShoot, bullet: Bullet): void {
    this.shootRelative.forEach(shootRelative => {
      if (shootRelative.from == who && shootRelative.to == this) {
        shootRelative.handle(bullet);
      }
    });
  }
  bullet_sx: number;
  bullet_sy: number;
  bullet_ex: number;
  bullet_ey: number;
  setBulletStartXY(x, y): void{

  }
  setBulletEndXY(x, y): void{
    
  }
  autoShootMark: any;
  autoShoot(): void{
    this.autoShootMark = setInterval(() => {
      setTimeout(() => this.shoot(), 200 * 0)
      setTimeout(() => this.shoot(), 200 * 1)
      setTimeout(() => this.shoot(), 200 * 2)
    }, 1500)
  }
  closeAutoShoot(): void{
    clearInterval(this.autoShootMark);
  }
  dying(): void {
    if(this.isAlive == false){
      return;
    }
    // 这里需要从原数组删除元素，所以必须在一个新的数组上进行遍历
    [].slice.call(this.bullets).forEach( bullet => bullet.over());
    this.jumpAnimate && this.jumpAnimate.setPaused(true);
    this.rlRunAnimate && this.rlRunAnimate.setPaused(true);
    
    this.jumpNumber = 0;
    this.isAlive = false;
    if(this.scenceState == Game.BOSS_LEVE_3){
      this.decease2();
    }else{
      this.decease();
    }
    setTimeout(() => {
      this.isAlive = true;
      if(this.scenceState == Game.BOSS_LEVE_3){
        this.stand2();
        this.openGod();
      }else{
        this.standAnimate();
      }
      
    }, 2000);
  }
  rlRunAnimate: createjs.Tween;
  rlRunstandence = 60;
  leftRun():void{
    if(this.isAlive == false){
      return;
    }
    if(this.curDisplay.x < 200){
      console.log('超出范围')
      return ;
    }

    this.rlRunAnimate && this.rlRunAnimate.setPaused(true);
    this.state = 'lrun';
    this.playerLeftRun.x = this.curDisplay.x;
    this.playerLeftRun.y = this.curDisplay.y;
    this.curDisplay = this.playerLeftRun;
    this.clearStateExpect(this.curDisplay);
    this.renderList.push(this.curDisplay);
    this.rlRunAnimate = createjs.Tween.get(this.playerLeftRun)
      .to({x: this.curDisplay.x - this.rlRunstandence}, 300)
      .call( () => this.stand2(this.curDisplay.x) )
  }
  rightRun(): void{
    if(this.isAlive == false){
      return;
    }
    if(this.curDisplay.x > 900){
      console.log('超出范围')
      return ;
    }

    this.rlRunAnimate && this.rlRunAnimate.setPaused(true);
    this.state = 'rrun';
    this.playerRightRun.x = this.curDisplay.x;
    this.playerRightRun.y = this.curDisplay.y;
    this.curDisplay = this.playerRightRun;
    this.clearStateExpect(this.curDisplay);
    this.renderList.push(this.curDisplay);
    this.rlRunAnimate = createjs.Tween.get(this.playerRightRun)
      .to({x: this.curDisplay.x + this.rlRunstandence}, 300)
      .call( () => this.stand2(this.curDisplay.x) )
  }
  
}