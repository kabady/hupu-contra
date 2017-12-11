import { CanShoot } from "./canShoot";
import { CanShot } from "./canShot";
import { Bullet } from "./bullet";
import { NextFrameRunTime } from "./nextFrameRunTime";

export class Player implements CanShoot, CanShot, NextFrameRunTime{
  el: createjs.DisplayObject;

  renderList: Array<createjs.DisplayObject> = [];
  removeList: Array<createjs.DisplayObject> = [];

  playerRun: createjs.DisplayObject;
  playerStand: createjs.DisplayObject;
  playerDecease: createjs.DisplayObject;
  playerShooting: createjs.DisplayObject;
  state: string = '';

  curDisplay: createjs.DisplayObject;
  constructor(){
    //创建一个显示对象
    var playerSheet = new createjs.SpriteSheet({
      framerate: 30,
      images: [require("../../_assets/hero.png")],
      frames: {regX: 0, regY: 0, height: 250, width: 250, count: 10},
      // define two animations, run (loops, 1.5x speed) and jump (returns to run):
      animations: {
        run: {frames: [1, 2], speed: .12},
        stand: {frames: [0]},
        decease: {frames: [3, 4], speed: .2, next: 'down'},
        down: {
          frames: [5, 6, 7, 8, 9], speed: .2
        }
      }
    });

    this.playerRun = new createjs.Sprite(playerSheet, "run");
    this.playerStand = new createjs.Sprite(playerSheet, "stand");
    this.playerDecease = new createjs.Sprite(playerSheet, "decease");
    this.playerShooting = new createjs.Sprite(playerSheet, "stand");
    
    this.playerRun.y = this.playerStand.y = this.playerDecease.y = this.playerShooting.y = 550;
  }
  clearState(): void{
    this.removeList.push(this.playerRun);
    this.removeList.push(this.playerStand);
    this.removeList.push(this.playerDecease);
  }
  clearStateExpect(expectObject: createjs.DisplayObject): void{
    if(expectObject !== this.playerRun){
      this.removeList.push(this.playerRun);
    }
    if(expectObject !== this.playerStand){
      this.removeList.push(this.playerStand);
    }
    if(expectObject !== this.playerDecease){
      this.removeList.push(this.playerDecease);
    }
    if(expectObject !== this.playerShooting){
      this.removeList.push(this.playerShooting);
    }
  }
  run(): void{
    this.state = 'run';
    this.curDisplay = this.playerRun;
    this.clearStateExpect(this.playerRun);
    this.renderList.push(this.playerRun);
  }
  stand(): void{
    this.state = 'stand';
    this.curDisplay = this.playerStand;
    this.clearStateExpect(this.playerStand);
    this.renderList.push(this.playerStand);
  }
  decease(): void{
    this.state = 'decease';
    this.curDisplay = this.playerDecease;
    this.clearStateExpect(this.playerDecease);
    this.renderList.push(this.playerDecease);
  }
  shootSomeOne(who: CanShot, handle: () => void): void{
    
  }
  shot(shooter: CanShoot, handle: () => void): void{
    
  }
  shoot(handle: (bullets: Array<createjs.DisplayObject>) => void): void{
    this.state = 'shoot';
    this.curDisplay = this.playerShooting;
    this.clearStateExpect(this.playerShooting);
    this.renderList.push(this.playerShooting);
    
    this.setNextFrameRun(() => {
      let bounds: createjs.Rectangle =  this.curDisplay.getBounds();
      if(bounds == null){
        throw new Error('no bounds');
      }else{
        let base_x: number = this.curDisplay.x;
        let base_y: number = this.curDisplay.y;
        let bullets: Array<createjs.DisplayObject> = [];
        for(let i = 0, len = 1; i < len; i++){

          let bullet: Bullet = new Bullet();
          bullets.push(bullet.displayObject);
          bullet.setStart(base_x + bounds.x + bounds.width * .9, base_y + bounds.y + bounds.height * .33);
          this.renderList.push(bullet.displayObject);
          bullet.setOver(() => this.removeList.push(bullet.displayObject));
          bullet.launch();
        }
        
        handle(bullets);
      }
    });
    
    // bullet.setStart();
  }
  nextFrameRunList: Array<()=>void> = [];
  nextFrameRun(): void{
    for(let i = 0, len = this.nextFrameRunList.length; i < len; i++){
      try{
        this.nextFrameRunList[i]();
        this.nextFrameRunList.splice(i, 1);
      }catch(e){
        
      }
    }
  }
  setNextFrameRun(handle: () => void): void{
    this.nextFrameRunList.push(handle);
  }
  removeRenderCache(index: number){
    this.renderList.splice(index, 1);
  }
  clearRenderCache(): void{
    this.renderList = [];
  }
  clearRemoveCache(): void{
    this.removeList = [];
  }
}