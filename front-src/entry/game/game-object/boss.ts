import { CanShot } from "../canShot";
import { CanShoot, ShootRelative } from "../canShoot";
import { Bullet } from "./bullet";
import { assetMapQueue } from "../game-asset";

export class Boss implements CanShot{
  static readonly LEVEL_0 = 0;
  static readonly LEVEL_1 = 1;
  static readonly LEVEL_2 = 2;
  static readonly LEVEL_3 = 3;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  boss1: createjs.DisplayObject;
  boss0: createjs.DisplayObject;
  curDisplay: createjs.DisplayObject;
  bullets: Array<Bullet>

  removeBullet(bullet: Bullet): void{

  }
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
  clearRenderCache(): void{
    this.renderList = [];
  }
  clearRemoveCache(): void{
    this.removeList = [];
  }
  shootSomeOne(who: CanShot, handle: () => void): void{

  }
	shoot(handle: (bullets: Array<Bullet>) => void): void{

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
  }
}