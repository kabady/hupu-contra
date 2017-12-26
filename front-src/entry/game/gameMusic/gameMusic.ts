import './gameMusic.scss';
let html: string = require('./gameMusic.html');

let _window: any = window;
let wx: any = _window.wx;

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
    this.preload();
  }
  preload(){
    wx.ready(() => {
      this.audio.play();
      setTimeout(() => {
        this.pause();
      }, 100);
    })
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
  rePlay(){
    if(this.isDisplay){
      $(this.elem).removeClass('stop')
      this.audio.currentTime = 0;
      this.audio.play();
      this.isPlay = true;
    }
  }
  play(): void{
    if(this.isDisplay){
      this.audio.currentTime = 0;
      this.audio.play();
      $(this.elem).removeClass('stop')
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

export class GameAudio {
  audio: HTMLAudioElement
  constructor(src: string) {
    this.audio = new Audio();
    this.audio.controls = true;
    this.setSrc(src);
    this.preload();
  }
  preload(){
    wx.ready(() => {
      this.audio.play();
      setTimeout(() => {
        this.pause();
      }, 200);
    });
  }
  setSrc(src: string){
    this.audio.src = src;
  }
  play(){
    this.audio.currentTime = 0;
    this.audio.play();
  }
  pause(){
    this.audio.pause();
  }
}
class MultipleGameAudio {
  src: string;
  audioList: Array<HTMLAudioElement> = [];
  constructor(src) {
    this.src = src;
    for(let i = 0; i < 3; i++){
      let audio = new Audio();
      audio.src = this.src;
      audio.preload = 'auto';
      audio.volume = 0;
      this.audioList.push(audio);
    }
    this.preload();
  }
  preload(){
    wx.ready(() => {
      this.audioList.forEach(audio => {
        audio.play();
        setTimeout(() => {
          audio.pause();
        }, 100);
      })
    })
  }
  play(){
    let audio = this.audioList.pop();
    audio.play();
    audio.currentTime = 0;
    this.audioList.unshift(audio);
  }
}

export let shotAudio = new GameAudio(require('../../../_assets/shot.mp3'));
export let shootAudio = new GameAudio(require('../../../_assets/shoot.mp3'));
export let dyingAudio = new GameAudio(require('../../../_assets/dying.mp3'));
export let victoryAudio = new GameAudio(require('../../../_assets/victory.mp3'));
export let jumpAudio = new GameAudio(require('../../../_assets/jump.mp3'));

export function AudioPreload(){
  shotAudio.preload();
  shootAudio.preload();
  dyingAudio.preload();
  victoryAudio.preload();
  jumpAudio.preload();
}