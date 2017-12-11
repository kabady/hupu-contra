import { CanShot } from "./canShot";
import { CanShoot } from "./canShoot";

export class Boss implements CanShot, CanShoot{
  readonly STATE_BOSS_NO_ONE: number = 1;
  readonly STATE_BOSS_NO_TWO: number = 2;
  readonly STATE_BOSS_NO_THREE: number = 3;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  boss1: createjs.DisplayObject;
  curDisplay: createjs.DisplayObject;
  constructor(){
    this.boss1 = new createjs.Bitmap(require('../../_assets/boss1.png'));
    this.boss1.x = 1000;
    this.boss1.y = 0;
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void{
    if(expectObject !== this.boss1){
      this.removeList.push(this.boss1);
    }
  }
  setState(state: number): void{
    switch(state){
      case this.STATE_BOSS_NO_ONE:
      this.curDisplay = this.boss1;
      this.clearStateExpect(this.boss1);
      this.renderList.push(this.boss1);
      break;
      case this.STATE_BOSS_NO_TWO:

      break;
      case this.STATE_BOSS_NO_THREE:

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
	shoot(handle: (bullets: Array<createjs.DisplayObject>) => void): void{

  }
  shot(shooter: CanShoot, handle: () => void): void{
    
  }
}