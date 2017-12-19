import '../style/reset-1.0.0.css';
import '../style/index.scss';
import 'createjs';

import { RemInit } from '../build-lib/Rem'
import { OrientationTip } from './orientLayer/orientLayer';
import { App } from './app/app'
import { Game } from './game/game'
import { routes } from '../router';
import { pushLoadComplete, pushGameOverHandle, pushLastPageHandle } from './game/game-asset';
import { GameOver } from './game/gameOver/gameOver';
import { LastPage } from './last/last';
import { gameMusic } from './game/gameMusic/gameMusic';


function appInit(): void{
  RemInit();
  new OrientationTip().show();
  let app: App = new App();
  app.show();
  let game: Game;
  let gameOver: GameOver;
  pushLoadComplete(function(){
    app.hide();
    game = new Game();
    game.show();
    gameMusic.show();
    gameMusic.play();
  });
  pushGameOverHandle( function(stage){
    game.GameOver(stage)
    game.hide();
    gameOver = new GameOver();
    gameOver.show();
  })
  pushLastPageHandle(function(){
    gameOver.hide();
    new LastPage().show();
  })
  document.body.addEventListener('touchstart', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  })
  document.body.addEventListener('touchmove', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  })
  document.body.addEventListener('touchend', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  })
  $(() => {
    require('fastclick').attach(document.body);
  })
}

appInit();
