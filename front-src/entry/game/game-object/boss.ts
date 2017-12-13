import { CanShot } from "../canShot";
import { CanShoot, ShootRelative } from "../canShoot";
import { Bullet } from "./bullet";
import { assetMapQueue } from "../game-asset";

export class Boss implements CanShot, CanShoot{
  static readonly LEVEL_0 = 0;
  static readonly LEVEL_1 = 1;
  static readonly LEVEL_2 = 2;
  static readonly LEVEL_3 = 3;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  boss1: createjs.DisplayObject;
  boss0: createjs.DisplayObject;
  curDisplay: createjs.DisplayObject;
  
  constructor(){
    this.boss0 = new createjs.Bitmap(assetMapQueue.getResult('boss0'));
    this.boss0.x = 1000;
    this.boss0.y = 450;
    
    this.boss1 = new createjs.Bitmap(assetMapQueue.getResult('boss1'));
    this.boss1.x = 1000;
    this.boss1.y = 500;
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void{
    if(expectObject !== this.boss1){
      this.removeList.push(this.boss1);
    }
    if(expectObject !== this.boss0){
      this.removeList.push(this.boss0);
    }
  }
  setState(state: number): void{
    switch(state){
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
      this.curDisplay = this.boss0;
      this.clearStateExpect(this.curDisplay);
      this.renderList.push(this.curDisplay);

      break;
      case Boss.LEVEL_2:
      this.curDisplay = this.boss1;
      this.clearStateExpect(this.curDisplay);
      this.renderList.push(this.curDisplay);

      break;
    }
  }
  it: any;
  closeAutoShoot(): void{
    clearInterval(this.it);
  }
  startAutoShoot(): void{
    this.it = setInterval(() => {
      this.shoot()
    }, 3000)
    this.shoot()
  }
  clearRenderCache(): void{
    this.renderList = [];
  }
  clearRemoveCache(): void{
    this.removeList = [];
  }
  shootRelative: Array<ShootRelative> = [];
  shot(shooter: CanShoot, handle: (bullet: Bullet) => void): void{
    this.shootRelative.push({
      from: shooter,
      to: this,
      handle: handle
    })
  }
  hasBeenShot(who: CanShoot, bullet: Bullet){
    this.shootRelative.forEach(shootRelative => {
      if(shootRelative.from == who && shootRelative.to == this){
        shootRelative.handle(bullet);
      }
    });
  }
  hide(): void{
    this.removeList.push(this.boss0);
    this.removeList.push(this.boss1);
    this.removeList.push(this.boss1);
    this.removeList.push(this.boss1);
    this.curDisplay = null;
    this.bullets.forEach( bullet => bullet.over() );
  }

	/**
	 * who被射击到了，做什么（handle）
	 * 
	 * @param {CanShot} who 
	 * @param {() => void} handle 
	 * @memberof CanShoot
	 */
	shootSomeOne(who: CanShot, handle: (bullet: Bullet) => void): void{
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
	shoot(): void{
    let bounds: createjs.Rectangle =  this.curDisplay.getBounds();
    if(bounds == null){
      throw new Error('no bounds');
    }else{
      let base_x: number = this.curDisplay.x;
      let base_y: number = this.curDisplay.y;
      let bullets: Array<Bullet> = [];
      for(let i = 0, len = 1; i < len; i++){
        let bullet: Bullet = new Bullet();
        bullet.setbullet('boss1Bullet');
        bullet.setFrom(this);
        bullets.push(bullet);
        bullet.setStart(base_x + bounds.x + bounds.width * .2, base_y + bounds.y + bounds.height * .2);
        bullet.setEnd(-50);
        this.renderList.push(bullet.displayObject);
        bullet.setOver(() => this.removeList.push(bullet.displayObject));
        bullet.launch();
      }
      this.bullets = this.bullets.concat(bullets);
    }
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
	removeBullet(bullet: Bullet): void{
    for(let i = this.bullets.length - 1; i >= 0; i--){
      if(this.bullets[i] == bullet)
        this.removeList.push(this.bullets.splice(i, 1)[0].displayObject);
    }
  }

	// WHO 已经被击中了
	hasShot(who: CanShot, bullet: Bullet): void{
    this.shootRelative.forEach( (shootRelative) => {
      if(shootRelative.to == who && shootRelative.from == this){
        shootRelative.handle(bullet);
      }
    })
  }
}