import { CanShot } from "../canShot";
import { CanShoot, ShootRelative } from "../canShoot";
import { Bullet } from "./bullet";
import { assetMapQueue } from "../game-asset";
import { setTimeout } from "timers";

export class Boss implements CanShot, CanShoot {
  static readonly LEVEL_0 = 0;
  static readonly LEVEL_1 = 1;
  static readonly LEVEL_2 = 2;
  static readonly LEVEL_3 = 3;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  boss0: createjs.DisplayObject;
  boss1: createjs.DisplayObject;
  boss2: createjs.DisplayObject;
  boss3: createjs.DisplayObject;
  boss2Bg: createjs.DisplayObject;
  boss3Bg: createjs.DisplayObject;
  curDisplay: createjs.DisplayObject;
  curLevel: number;

  bossSheet: createjs.SpriteSheet;
  constructor() {
    this.bossSheet = new createjs.SpriteSheet({
      framerate: 30,
      images: [assetMapQueue.getResult('bossSheet')],
      frames: { regX: 0, regY: 0, height: 500, width: 500, count: 7 },
      // define two animations, run (loops, 1.5x speed) and jump (returns to run):
      animations: {
        stand: { frames: [0] },
        death: { frames: [1, 2, 3, 4, 5], speed: .75, next: 'died' },
        died: {frames: [6]}
      }
    });
    
    this.boss0 = new createjs.Bitmap(assetMapQueue.getResult('boss0'));
    this.boss0.x = 1000;
    this.boss0.y = 450;

    this.boss1 = new createjs.Bitmap(assetMapQueue.getResult('boss1'));
    this.boss1.x = 1000;
    this.boss1.y = 500;

    this.boss2 = new createjs.Bitmap(assetMapQueue.getResult('boss2'));
    // this.boss2.scaleX = this.boss2.scaleY = 1500 / 1800;
    this.boss2.scaleX = .9;
    this.boss2.x = 1010;
    this.boss2.y = 340;
    // this.boss2.y = 430;

    this.boss2Bg = new createjs.Bitmap(assetMapQueue.getResult('boss2Bg'));
    // this.boss2Bg.scaleX = this.boss2Bg.scaleY = 1500 / 1800;
    this.boss2Bg.scaleX = .8;
    this.boss2Bg.x = 1000;
    this.boss2Bg.y = 10;


    // this.boss3 = new createjs.Bitmap(assetMapQueue.getResult('boss3'));
    this.boss3 = new createjs.Sprite(this.bossSheet, "stand");
    this.boss3.scaleX = this.boss3.scaleY = 1;
    this.boss3.scaleX = .85
    this.boss3.x = 550;
    this.boss3.y = -40;
    this.boss3.setBounds(100, 111, 170, 112);

    
    this.boss3Bg = new createjs.Bitmap(assetMapQueue.getResult('boss3'));
    this.boss3Bg.scaleX = this.boss3.scaleY
    this.boss3Bg.scaleX = this.boss3.scaleX
    this.boss3Bg.x = this.boss3.x;
    this.boss3Bg.y = this.boss3.y;
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void {
    if (expectObject !== this.boss0) {
      this.removeList.push(this.boss0);
    }
    if (expectObject !== this.boss1) {
      this.removeList.push(this.boss1);
    }
    if (expectObject !== this.boss2) {
      this.removeList.push(this.boss2);
    }
    if (expectObject !== this.boss3) {
      this.removeList.push(this.boss3);
    }
  }
  setState(state: number): void {
    this.curLevel = state;
    this.removeList.push(this.boss2Bg);
    switch (state) {
      case Boss.LEVEL_0:
        this.curDisplay = this.boss0;
        this.clearStateExpect(this.curDisplay);
        this.renderList.push(this.curDisplay);
        break;

      case Boss.LEVEL_1:
        this.curDisplay = this.boss1;
        this.clearStateExpect(this.curDisplay);
        this.renderList.push(this.curDisplay);
        break;

      case Boss.LEVEL_2:
        this.curDisplay = this.boss2;
        this.clearStateExpect(this.curDisplay);
        this.renderList.push(this.curDisplay);
        this.renderList.push(this.boss2Bg);
        break;

      case Boss.LEVEL_3:
        this.curDisplay = this.boss3;
        this.clearStateExpect(this.curDisplay);
        this.renderList.push(this.curDisplay);
        // this.renderList.push(this.boss3Bg);
        break;
    }
  }
  it: any;
  closeAutoShoot(): void {
    clearInterval(this.it);
  }
  startAutoShoot(): void {
    this.it = setInterval(() => {
      this.shoot()
    }, 5000)
    this.shoot()
  }
  clearRenderCache(): void {
    this.renderList = [];
  }
  clearRemoveCache(): void {
    this.removeList = [];
  }
  shootRelative: Array<ShootRelative> = [];
  shot(shooter: CanShoot, handle: (bullet: Bullet) => void): void {
    this.shootRelative.push({
      from: shooter,
      to: this,
      handle: handle
    })
  }
  hasBeenShot(who: CanShoot, bullet: Bullet, pos: any): boolean {
    for (let i = 0, len = this.shootRelative.length; i < len; i++) {
      let shootRelative = this.shootRelative[i];
      if (shootRelative.from == who && shootRelative.to == this) {
        if (this.curLevel == Boss.LEVEL_3) {
          let boss3Bounds = this.boss3.getBounds()
          if (
            690 < pos.x && pos.x < 800
            &&
            this.boss3.y + boss3Bounds.y < pos.y && pos.y < this.boss3.y + boss3Bounds.y + + boss3Bounds.height
          ) {
            shootRelative.handle(bullet);
            this.dying()
            return true;
          } else {
            return false;
          }
        }
        shootRelative.handle(bullet);
        this.dying()
        return true;
      }
    }
    return false;
  }
  hide(): void {
    this.removeList.push(this.boss0);
    this.removeList.push(this.boss1);
    this.removeList.push(this.boss1);
    this.removeList.push(this.boss1);
    this.curDisplay = null;
    this.bullets.forEach(bullet => bullet.over());
  }

	/**
	 * who被射击到了，做什么（handle）
	 * 
	 * @param {CanShot} who 
	 * @param {() => void} handle 
	 * @memberof CanShoot
	 */
  shootSomeOne(who: CanShot, handle: (bullet: Bullet) => void): void {
    this.shootRelative.push({
      from: this,
      to: who,
      handle: handle
    })
  }
	/**
	 * 发射子弹
	 * 
	 * @memberof CanShoot
	 */
  boss2TestLoop: number = 0;
  shootEnd(end_y: number): Bullet {
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
        if (this.curLevel == Boss.LEVEL_0) {
          bullet.setStart(base_x + bounds.x + bounds.width * .2, base_y + bounds.y + bounds.height * .2);
          bullet.setEnd(end_y);
        }
        this.renderList.push(bullet.displayObject);
        // bullet.setOver(() => this.removeList.push(bullet.displayObject));
        bullet.launch();
        this.bullets = this.bullets.concat(bullets);
        return bullet;
      }
    }
  }
  shoot(): void {
    let bounds: createjs.Rectangle = this.curDisplay.getBounds();
    if (bounds == null) {
      throw new Error('no bounds');
    } else {
      let base_x: number = this.curDisplay.x;
      let base_y: number = this.curDisplay.y;
      let bullets: Array<Bullet> = [];
      let bullets_len = 1;
      if (this.curLevel == Boss.LEVEL_3){
        bullets_len = 2;
      }
      for (let i = 0, len = bullets_len; i < len; i++) {
        let bullet: Bullet = new Bullet();
        bullet.setFrom(this);
        bullets.push(bullet);
        if (this.curLevel == Boss.LEVEL_0) {

        } else if (this.curLevel == Boss.LEVEL_1) {
          bullet.setbullet(Bullet.BOSS_1_BULLET);
          bullet.setStart(base_x + bounds.x + bounds.width * .2, base_y + bounds.y + bounds.height * .2);
          bullet.setEnd(-50);
        } else if (this.curLevel == Boss.LEVEL_2) {
          bullet.setbullet(Bullet.BOSS_2_BULLET, '你行你上'[this.boss2TestLoop % 4]);
          this.boss2TestLoop++;
          bullet.setStart(base_x + bounds.x + bounds.width * .2, base_y + bounds.y + bounds.height * .2);
          bullet.setEnd(400, 800);
          bullet.displayObject.scaleX = bullet.displayObject.scaleY = .4;
          bullet.addAnimation(bulletDisplayObj => {
            return createjs.Tween.get(bulletDisplayObj)
              .to({ x: bullet.end_x, visible: false }, 1500)
          })
          bullet.addAnimation(bulletDisplayObj => {
            return createjs.Tween.get(bulletDisplayObj)
              // .to({y: 100, visible:false}, 500, createjs.Ease.backIn)
              .to({ y: bullet.end_y, visible: false }, 1500, createjs.Ease.backIn)
          })
          // boss2嘴巴张开
          this.boss2MouthAnimate();
        } else if (this.curLevel == Boss.LEVEL_3) {
          bullet.setbullet(Bullet.BOSS_3_BULLET);
          bullet.displayObject.scaleX = bullet.displayObject.scaleY = .5;
          bullet.setStart(base_x + bounds.x + bounds.width * (.4 + i * .45), base_y + bounds.y + bounds.height * .4);
          bullet.setEnd(base_x + bounds.x + bounds.width * (.4 + i * .45), 1000);
          bullet.setAnimateTime(3000);
          // bullet.setGodBullet();
        }
        this.renderList.push(bullet.displayObject);
        bullet.setOver(() => this.removeList.push(bullet.displayObject));
        bullet.launch();
      }
      this.bullets = this.bullets.concat(bullets);
    }
  }
  boss2MouthAnimate() {
    this.boss2.y = 430;
    setTimeout(() => {
      this.boss2.y = 340;
    }, 1000)
  }
	/**
	 * 子弹数组
	 * 
	 * @type {Array<Bullet>}
	 * @memberof CanShoot
	 */
  bullets: Array<Bullet> = [];
	/**
	 * 从子弹从属的物体中删除子弹
	 * 
	 * @param {Bullet} bullet 
	 * @memberof CanShoot
	 */
  removeBullet(bullet: Bullet): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i] == bullet)
        this.removeList.push(this.bullets.splice(i, 1)[0].displayObject);
    }
  }

  // WHO 已经被击中了
  hasShot(who: CanShot, bullet: Bullet): void {
    this.shootRelative.forEach((shootRelative) => {
      if (shootRelative.to == who && shootRelative.from == this) {
        shootRelative.handle(bullet);
      }
    })
  }
  dying(): void {
    if (this.curLevel == Boss.LEVEL_2) {
      createjs.Tween.get(this.boss2)
        .to({ y: 650 }, 500)
    }else if(this.curLevel == Boss.LEVEL_3){
      this.removeList.push(this.boss3);

      let boss3 = new createjs.Sprite(this.bossSheet, "death");
      boss3.scaleX = this.boss3.scaleY
      boss3.scaleX = this.boss3.scaleX
      boss3.x = this.boss3.x
      boss3.y = this.boss3.y
      boss3.setBounds(100, 111, 170, 112);
      this.curDisplay = boss3;
      this.renderList.push(this.curDisplay)
    }
  }
}