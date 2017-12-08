import '../style/index.scss';
import 'createjs';

import { RemInit } from '../build-lib/Rem'
import { OrientationTip } from './orientLayer/orientLayer';
import { App } from './app/app'
import { Game } from './game/game'
import { routes } from '../router';



function appInit(): void{
  RemInit();
  new OrientationTip().hide();
  new App().hide();
  new Game().show();
}

appInit();