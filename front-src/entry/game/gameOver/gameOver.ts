import './gameOver.scss';
let html: string = require('./gameOver.html');
import { Page } from "../../page";
import { Player } from '../game-object/player';
import { showRatio } from '../game';
import { assetMapQueue, lastPageShow } from '../game-asset';
import { gameCtrl } from '../gameCtrl/gameCtrl';

export class GameOver implements Page {
  elemList: Array<Element> = [];
  player: Player = new Player();
  stage: createjs.Stage;
  canvas: Element;
  showContainer_height: number;
  showContainer_width: number;
  state = 0;
  basketball: createjs.DisplayObject;
  basketballLine = [{"x":599.6523754345308,"y":645.0853658536586},{"x":599.6523754345308,"y":643.0243902439024},{"x":604.86674391657,"y":634.780487804878},{"x":608.342989571263,"y":628.5975609756098},{"x":617.0336037079953,"y":618.2926829268292},{"x":620.5098493626883,"y":607.9878048780488},{"x":629.2004634994206,"y":593.560975609756},{"x":637.8910776361529,"y":579.1341463414634},{"x":653.5341830822712,"y":556.4634146341464},{"x":665.7010428736965,"y":535.8536585365854},{"x":674.3916570104287,"y":519.3658536585366},{"x":686.558516801854,"y":504.9390243902439},{"x":695.2491309385864,"y":490.5121951219512},{"x":705.6778679026652,"y":478.1463414634146},{"x":717.8447276940904,"y":467.8414634146342},{"x":731.7497103128621,"y":453.4146341463415},{"x":745.6546929316339,"y":441.0487804878049},{"x":761.2977983777521,"y":430.7439024390244},{"x":778.6790266512166,"y":418.3780487804878},{"x":799.5365005793742,"y":408.0731707317073},{"x":820.3939745075319,"y":395.70731707317077},{"x":837.7752027809964,"y":387.4634146341464},{"x":853.4183082271148,"y":377.1585365853659},{"x":870.7995365005794,"y":364.7926829268293},{"x":877.7520278099652,"y":360.6707317073171},{"x":889.9188876013905,"y":354.4878048780488},{"x":902.0857473928157,"y":346.2439024390244},{"x":912.5144843568945,"y":342.1219512195122},{"x":924.6813441483198,"y":333.8780487804878},{"x":935.1100811123986,"y":329.7560975609756},{"x":940.3244495944381,"y":327.6951219512195},{"x":949.0150637311704,"y":323.5731707317073},{"x":955.9675550405562,"y":321.5121951219512},{"x":962.920046349942,"y":319.4512195121951},{"x":969.8725376593279,"y":315.3292682926829},{"x":978.5631517960602,"y":313.2682926829268},{"x":988.9918887601391,"y":311.2073170731707},{"x":995.9443800695249,"y":309.1463414634146},{"x":1004.6349942062571,"y":305.0243902439024},{"x":1015.063731170336,"y":302.9634146341463},{"x":1020.2780996523754,"y":300.9024390243902},{"x":1027.2305909617614,"y":298.8414634146341},{"x":1034.1830822711472,"y":296.780487804878},{"x":1039.3974507531866,"y":296.780487804878},{"x":1046.3499420625724,"y":294.7195121951219},{"x":1049.8261877172654,"y":294.7195121951219},{"x":1053.3024333719584,"y":294.7195121951219},{"x":1060.2549246813442,"y":294.7195121951219},{"x":1061.9930475086906,"y":294.7195121951219},{"x":1067.20741599073,"y":294.7195121951219},{"x":1070.683661645423,"y":296.780487804878},{"x":1074.159907300116,"y":300.9024390243902},{"x":1077.6361529548087,"y":302.9634146341463},{"x":1081.1123986095017,"y":305.0243902439024},{"x":1086.3267670915411,"y":309.1463414634146},{"x":1091.5411355735805,"y":313.2682926829268},{"x":1095.0173812282735,"y":319.4512195121951},{"x":1098.4936268829665,"y":321.5121951219512},{"x":1101.9698725376593,"y":323.5731707317073},{"x":1105.4461181923523,"y":325.6341463414634},{"x":1107.1842410196987,"y":327.6951219512195},{"x":1108.9223638470453,"y":327.6951219512195},{"x":1110.6604866743917,"y":331.8170731707317},{"x":1112.3986095017383,"y":333.8780487804878},{"x":1112.3986095017383,"y":335.9390243902439}];
  constructor() {
    let gameElem: HTMLElement = document.createElement('game-over');
    gameElem.innerHTML = html;
    document.querySelector('body').appendChild(gameElem);
    this.canvas = gameElem.querySelector('#game-over-canvas');
    this.elemList.push(gameElem);
  }
  hide(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'none' }));
  }
  show(): void {
    this.elemList.forEach((elem) => $(elem).css({ display: 'block' }));

    this.showContainer_height = 850;
    this.showContainer_width = 1500;

    this.canvas.setAttribute('width', this.showContainer_width + '');
    this.canvas.setAttribute('height', (this.showContainer_width / showRatio) + '');

    let stage = new createjs.Stage('game-over-canvas');
    this.stage = stage;
    createjs.Ticker.addEventListener("tick", (e) => this.createjsTicker(e));
    // createjs.Ticker.setFPS(10); //Deprecated
    this.player.setXY(-200, 580);
    this.player.run();
    stage.addChild(this.player.curDisplay);

    this.basketball = new createjs.Bitmap(assetMapQueue.getResult('basketball'));
    
    gameCtrl.hide();
    // this.manualCreateLine(); // 开启篮球路线
  }
  createjsTicker(e): void{
    if(this.state == 0){
      this.player.curDisplay.x += 8;
      if(this.player.curDisplay.x > 200){
        this.player.curDisplay.x = 200;
        let x = this.player.curDisplay.x, y = this.player.curDisplay.y;
        this.state = 1;
        this.stage.removeChild(this.player.curDisplay);
        this.player.stand3();
        this.stage.addChild(this.player.curDisplay);
      }
    }else if(this.state == 1){
      this.stage.addChild(this.basketball);
      let pos = this.basketballLine.shift();
      if(pos){
        this.basketball.x = pos.x - this.basketball.getBounds().width * .5;
        this.basketball.y = pos.y - this.basketball.getBounds().height * .5;
      }else{
        this.state = 2
      }
    }else if(this.state == 2){
      createjs.Ticker.removeAllEventListeners('tick');
      lastPageShow();
    }

    this.stage.update();
  }
  mouse = 'off';
  manualCreateLine(){
    let canvas: any = document.querySelector('#game-over-canvas');
    let moustLine = [], w = canvas.width, h = canvas.height, ww = canvas.clientWidth, hh = canvas.clientHeight;
    canvas.addEventListener('mousedown', () => {
      this.mouse = 'on';
      moustLine = [];
    })
    canvas.addEventListener('mouseup', () => {
      this.mouse = 'off';
      console.log(JSON.stringify(moustLine));
      setTimeout(() => {
        this.state = 1
        this.basketballLine = moustLine;
      }, 2000);
    })
    canvas.addEventListener('mousemove', (ev: any) => {
      if(this.mouse == 'on'){
        moustLine.push({
          x: ev.offsetX / ww * w,
          y: ev.offsetY / hh * h
        })
      }
    })
  }
}