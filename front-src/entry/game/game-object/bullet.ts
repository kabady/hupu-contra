import { CanShoot } from "../canShoot";
import { assetMapQueue, assetMapStr } from "../game-asset";

// const bulletTemp: createjs.DisplayObject = new createjs.Bitmap(assetMapQueue.getResult('heroBullet'));
let assetMapStrAny: any = assetMapStr;
export class Bullet {
  static BOSS_1_BULLET = 'boss1Bullet';
  static BOSS_2_BULLET = 'boss2Bullet';
  static BOSS_3_BULLET = 'boss3Bullet';
  displayObject: createjs.DisplayObject;
  x: number;
  y: number;
  end_x: number = 1800;
  end_y: number;
  from: CanShoot;

  bulletAnimation: createjs.Tween;
  bulletTemp: createjs.DisplayObject = new createjs.Bitmap(assetMapQueue.getResult('heroBullet'));
  overEventHandle: () => void = () => 0;
  shotOverEventHandle: () => void = () => 0;
  constructor() {
    this.displayObject = this.bulletTemp.clone();
  }
  animateTime: number = 1500;
  setAnimateTime(time: number): void{
    this.animateTime = time
  }
  setbullet(bulletName: string, boss2Txt?: string){
    switch(bulletName){
      case Bullet.BOSS_1_BULLET:
      this.displayObject = new createjs.Bitmap(assetMapQueue.getResult(bulletName));
      
      break;

      case Bullet.BOSS_2_BULLET:
      let obj = {
        '你': assetMapQueue.getResult('boss2Bullet1'),
        '行': assetMapQueue.getResult('boss2Bullet2'),
        '上': assetMapQueue.getResult('boss2Bullet3')
      }
      this.displayObject = new createjs.Bitmap(obj[boss2Txt]);
      break;

      case Bullet.BOSS_3_BULLET:
      this.displayObject = new createjs.Bitmap(assetMapQueue.getResult(bulletName));
      break;
    }
  }
  setFrom(from: CanShoot){
    this.from = from;
  }
  setStart(x: number, y: number): void{
    this.x = x;
    this.y = y;
    this.displayObject.x = x;
    this.displayObject.y = y;
  }
  setEnd(x: number, y?: number): void{
    this.end_x = x;
    this.end_y = y || this.end_y || this.y || 0;
  }
  launch(): void{
    if(this.addAnimationList.length == 0){
      this.end_y = this.end_y || this.y;
      this.bulletAnimation = createjs.Tween.get(this.displayObject)
      .to({x: this.end_x, y: this.end_y, visible:false}, this.animateTime)
      .call(() => this.over());
    }else{
      this.addAnimationList.forEach( aniamte=> this.bulletAnimationList.push(aniamte(this.displayObject).call(()=> this.over())) );
    }
  }
  bulletAnimationList :Array<createjs.Tween> = [];
  addAnimationList: Array<(obj: createjs.DisplayObject) => createjs.Tween> = [];
  addAnimation(animateOBJ: (obj :createjs.DisplayObject) => createjs.Tween){
    this.addAnimationList.push(animateOBJ)
  }
  over(): void{
    this.overEventHandle();
  }
  setShotOverEventHandle(handle: () => void): void{
    this.shotOverEventHandle = () => {
      handle();
      this.overEventHandle();
    };
  }
  setOver(handle: () => void): void{
    this.overEventHandle = () => {
      handle();
      this.destory();
    };
  }
  destory(){
    this.bulletAnimation && this.bulletAnimation.setPaused(true);
    this.bulletAnimationList.forEach( tween => {
      tween.setPaused(true);
    } )
    if(this.isGodBullet == false){
      this.from.removeBullet(this);
    }
  }
  /**
   * 这个子弹将不在命中目标的时候消失
   * 
   * @memberof Boss
   */
  isGodBullet = false;
  /**
   * 这个子弹将不在命中目标的时候消失
   * 
   * @memberof Boss
   */
  setGodBullet(): void{
    this.isGodBullet = true;
  }
}