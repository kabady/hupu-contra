const bulletTemp: createjs.DisplayObject = new createjs.Bitmap(require('../../_assets/bullet.png'));
export class Bullet {
  displayObject: createjs.DisplayObject;
  x: number;
  y: number;
  end_x: number = 1800;
  end_y: number;
  overEventHandle: () => void = () => 0;
  shotOverEventHandle: () => void = () => 0;
  constructor() {
    this.displayObject = bulletTemp.clone();
  }
  setStart(x: number, y: number): void{
    this.displayObject.x = x;
    this.displayObject.y = y;
  }
  setEnd(x: number, y: number): void{
    this.end_x = x;
    this.end_y = y;
  }
  launch(): void{
    createjs.Tween.get(this.displayObject)
    .to({x: this.end_x, visible:false}, 1500)
    .call(() => this.over());
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
    this.overEventHandle = handle;
  }
}