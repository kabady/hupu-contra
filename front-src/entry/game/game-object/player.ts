import { CanShoot, ShootRelative } from "../canShoot";
import { CanShot } from "../canShot";
import { Bullet } from "./bullet";
import { NextFrameRunTime } from "../game";
import { assetMapQueue } from "../game-asset";

export class Player implements CanShoot, NextFrameRunTime, CanShot {
  el: createjs.DisplayObject;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  playerRun: createjs.DisplayObject;
  playerStand: createjs.DisplayObject;
  playerDecease: createjs.DisplayObject;
  playerShooting: createjs.DisplayObject;
  playerStandAnimate: createjs.DisplayObject;
  state: string = '';

  curDisplay: createjs.DisplayObject;
  bullets: Array<Bullet> = [];

  constructor() {
    //创建一个显示对象
    var playerSheet = new createjs.SpriteSheet({
      framerate: 30,
      images: [assetMapQueue.getResult('hero')],
      frames: { regX: 0, regY: 0, height: 250, width: 250, count: 10 },
      // define two animations, run (loops, 1.5x speed) and jump (returns to run):
      animations: {
        run: { frames: [1, 2], speed: .12 },
        stand: { frames: [0] },
        decease: { frames: [3, 4], speed: .2, next: 'down' },
        down: {
          frames: [5, 6, 7, 8],
          speed: .1
        },
        standAnimate: {
          frames: [9],
          speed: .2, next: 'stand'
        }
      }
    });

    this.playerRun = new createjs.Sprite(playerSheet, "run");
    this.playerStand = new createjs.Sprite(playerSheet, "stand");
    this.playerDecease = new createjs.Sprite(playerSheet, "decease");
    this.playerShooting = new createjs.Sprite(playerSheet, "stand");
    this.playerStandAnimate = new createjs.Sprite(playerSheet, "standAnimate");

    this.setXY(200, 450);
  }
  setXY(x: number, y: number): void {
    this.playerRun.x = this.playerStand.x = this.playerDecease.x = this.playerShooting.x = this.playerStandAnimate.x = x;
    this.playerRun.y = this.playerStand.y = this.playerDecease.y = this.playerShooting.y = this.playerStandAnimate.y = y;
  }
  clearState(): void {
    this.removeList.push(this.playerRun);
    this.removeList.push(this.playerStand);
    this.removeList.push(this.playerDecease);
  }
  standAnimate() {
    this.state = 'standAnimate';
    this.curDisplay = this.playerStandAnimate;
    this.clearStateExpect(this.playerStandAnimate);
    this.renderList.push(this.playerStandAnimate);
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
  enterNextScence(handle: () => void): void {
    this.setXY(200, 550);
    createjs.Tween.get(this.curDisplay)
      .to({ x: -200 }, 0)
      .to({ x: 200 }, 1000)
      .call(() => this.enterNextScenceOver(handle));
  }
  enterNextScenceOver(handle: ()=> void): void {
    this.stand();
    handle();
    console.log('i has entered');
  }
  stand(): void {
    this.state = 'stand';
    this.curDisplay = this.playerStand;
    this.clearStateExpect(this.playerStand);
    this.renderList.push(this.playerStand);
  }
  decease(): void {
    this.state = 'decease';
    this.curDisplay = this.playerDecease;
    this.clearStateExpect(this.playerDecease);
    this.renderList.push(this.playerDecease);
  }
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
    if(!(this.state == 'shoot' || this.state == 'stand' || this.state == 'standAnimate')){
      return;
    }
    this.state = 'shoot';
    this.curDisplay = this.playerShooting;
    this.clearStateExpect(this.playerShooting);
    this.renderList.push(this.playerShooting);

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
          bullet.setStart(base_x + bounds.x + bounds.width * .9, base_y + bounds.y + bounds.height * .33);
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
  dying(): void {
    this.bullets.forEach( bullet => bullet.over() );
    this.decease();
    setTimeout(() => {
      this.standAnimate();
    }, 2000);
  }
}