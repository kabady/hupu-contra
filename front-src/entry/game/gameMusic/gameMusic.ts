import './gameMusic.scss';
let html: string = require('./gameMusic.html');

export class GameMusic {
  elem: HTMLElement;
  audio: HTMLAudioElement;
  isDisplay: boolean = false;
  isPlay: boolean = false;
  constructor() {
    let musicElem = document.createElement('game-music');
    musicElem.innerHTML = html;
    document.querySelector('body').appendChild(musicElem);

    this.elem = musicElem.querySelector('.music-container');
    this.audio = new Audio();
    this.audio.src = require('../../../_assets/stage.mp3');
    this.audio.loop = true;
    this.isPlay = false;

    this.init();
  }
  init(): void{
    this.elem.addEventListener('click', (ev) => {
      if(this.isPlay){
        this.pause()
      }else{
        this.play();
      }
    })
    this.pause();
    this.hide();
  }
  pause(){
    this.audio.pause();
    $(this.elem).addClass('stop')
    this.isPlay = false;
  }
  play(): void{
    if(this.isDisplay){
      $(this.elem).removeClass('stop')
      this.audio.play();
      this.isPlay = true;
    }
  }
  show(): void{
    this.isDisplay = true;
    $(this.elem).css({ display: 'block' });
  }
  hide(): void{
    this.isDisplay = false;
    $(this.elem).css({ display: 'none' });
  }
}
export const gameMusic = new GameMusic();