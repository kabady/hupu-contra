export class Player{
  el: createjs.DisplayObject;
  bullets: Array<createjs.DisplayObject> = [];
  bulletTemp: createjs.DisplayObject;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  playerRun: createjs.DisplayObject;
  playerStand: createjs.DisplayObject;
  state: string = '';
  constructor(){
    //创建一个显示对象
    var playerSheet = new createjs.SpriteSheet({
      framerate: 30,
      images: [require("../../_assets/hero.png")],
      frames: {regX: 0, regY: 0, height: 250, width: 250, count: 3},
      // define two animations, run (loops, 1.5x speed) and jump (returns to run):
      animations: {
        run: {frames: [1, 2], speed: .15},
        stand: {frames: [0]}
      }
    });
    this.playerRun = new createjs.Sprite(playerSheet, "run");
    this.playerStand = new createjs.Sprite(playerSheet, "stand");


    // this.bulletTemp = new createjs.Bitmap(require('../../style/star.png'));
  }
  clearState(): void{
    this.removeList.push(this.playerRun);
    this.removeList.push(this.playerStand);
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void{
    if(expectObject !== this.playerRun){
      this.removeList.push(this.playerRun);
    }
    if(expectObject !== this.playerStand){
      this.removeList.push(this.playerStand);
    }
  }
  run(): void{
    this.state = 'run';
    this.clearStateExpect(this.playerRun);
    this.renderList.push(this.playerRun);
  }
  stand(): void{
    this.state = 'stand';
    this.clearStateExpect(this.playerStand);
    this.renderList.push(this.playerStand);
  }
  shoot(): Array<createjs.DisplayObject>{
    let bullet: createjs.DisplayObject = this.bulletTemp.clone();
    this.bullets.push(bullet);
    this.renderList.push(bullet);
    return this.bullets;
  }
  getBullets(): Array<createjs.DisplayObject>{
    return this.bullets;
  }
  removeRenderCache(index: number){
    this.renderList.splice(index, 1);
  }
  clearRenderCache(){
    this.renderList = [];
  }
  clearRemoveCache(){
    this.removeList = [];
  }
}