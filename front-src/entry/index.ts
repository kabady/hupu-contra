import '../style/index.scss';
import 'createjs';

import { RemInit } from '../build-lib/Rem'
import { OrientationTip } from './orientLayer/orientLayer';
import { App } from './app/app'
import { Game } from './game/game'
import { routes } from '../router';
import { pushLoadComplete } from './game/game-asset';


function appInit(): void{
  RemInit();
  new OrientationTip().show();
  let app: App = new App();
  app.show();
  pushLoadComplete(function(){
    app.hide();
    new Game().show();
  });
}

appInit();