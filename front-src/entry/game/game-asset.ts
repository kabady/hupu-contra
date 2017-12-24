export let assetMapQueue: createjs.LoadQueue = new createjs.LoadQueue();
export const assetMapStr: Object = {
  hero: require('../../_assets/hero.png'),
  heroBullet: require('../../_assets/hero-bullet.png'),
  boss0: require('../../_assets/boss-0.png'),
  boss1: require('../../_assets/boss-1.png'),
  boss1Playerword1: require('../../_assets/boss-1-player-word-1.jpg'),
  boss1Playerword2: require('../../_assets/boss-1-player-word-2.jpg'),
  boss1Playerword3: require('../../_assets/boss-1-player-word-3.jpg'),
  boss1Bullet: require('../../_assets/boss-1-bullet.png'),
  boss2: require('../../_assets/boss-2.png'),
  boss2Bg: require('../../_assets/boss-2-bg.png'),
  boss2Bullet1: require('../../_assets/boss-2-bullet-1.png'),
  boss2Bullet2: require('../../_assets/boss-2-bullet-2.png'),
  boss2Bullet3: require('../../_assets/boss-2-bullet-3.png'),
  boss2Playerword1: require('../../_assets/boss-2-player-word.jpg'),
  boss3: require('../../_assets/boss-3.png'),
  boss3Bullet: require('../../_assets/boss-3-bullet.png'),
  boss3Playerword1: require('../../_assets/boss-3-player-word.jpg'),
  scenes0: require('../../_assets/scenes-0.jpg'),
  scenes1: require('../../_assets/scenes-1.jpg'),
  scenes2: require('../../_assets/scenes-2.jpg'),
  scenes3: require('../../_assets/scenes-3.jpg'),

  basketball: require('../../_assets/basketball.png'),
  bossSheet: require('../../_assets/boss-3-sheet.png')
}
let loadCompleteArr: Array<()=>void> = [];
export function pushLoadComplete(loadComplete){
  loadCompleteArr.push(loadComplete);
}
/**
 * 最少要显示1秒种的loading页面
 * 
 * @export
 * @param {()=> void} handleComplete 
 */
export function startLoad(handleComplete: ()=> void = ()=> 0 ){
  let waitTime = 1000 * 3;
  let startTimeNumber: number = new Date().getTime();
  pushLoadComplete(handleComplete);
  
  assetMapQueue.on("complete", () => {
    let endTimeNumber: number = new Date().getTime();
    if(endTimeNumber - startTimeNumber > waitTime){
      loadCompleteArr.forEach((handleComplete)=>handleComplete());
    }else{
      setTimeout(
        ()=>loadCompleteArr.forEach((handleComplete)=>handleComplete()), 
        waitTime - (endTimeNumber - startTimeNumber)
      );
    }
  });
  let loadIds = [];
  for(let key in assetMapStr){
    if(assetMapStr.hasOwnProperty(key)){
      loadIds.push({id: key, src: assetMapStr[key]})
    }
  }
  assetMapQueue.loadManifest(loadIds);
}

let gameOverHandle = (stage) => {};
export function pushGameOverHandle(handle: (stage) => void){
  gameOverHandle = handle
}
export function gameOver(stage){
  gameOverHandle(stage);
}
let lastPageHandle = () => {};
export function pushLastPageHandle(handle: () => void){
  lastPageHandle = handle;
}
export function lastPageShow(){
  lastPageHandle()
}