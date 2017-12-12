export let assetMapQueue: createjs.LoadQueue = new createjs.LoadQueue();
export const assetMapStr: Object = {
  hero: require('../../_assets/hero.png'),
  heroBullet: require('../../_assets/hero-bullet.png'),
  boss0: require('../../_assets/boss-0.png'),
  boss1: require('../../_assets/boss-1.png'),
  scenes0: require('../../_assets/scenes-0.png'),
  scenes1: require('../../_assets/scenes-1.png'),
  scenes2: require('../../_assets/scenes-2.png'),
  scenes3: require('../../_assets/scenes-3.png')
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
  let startTimeNumber: number = new Date().getTime();
  pushLoadComplete(handleComplete);
  
  assetMapQueue.on("complete", () => {
    let endTimeNumber: number = new Date().getTime();
    
    if(endTimeNumber - startTimeNumber > 1000){
      loadCompleteArr.forEach((handleComplete)=>handleComplete());
    }else{
      setTimeout(
        ()=>loadCompleteArr.forEach((handleComplete)=>handleComplete()), 
        1000 - (endTimeNumber - startTimeNumber)
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