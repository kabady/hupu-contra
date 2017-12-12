$(() => {
  require('fastclick').attach(document.body);
})
export class GameCtrl{
  htmlContainer: HTMLElement;
  leftCtrl: HTMLElement;
  rightCtrl: HTMLElement;

  leftClickHandle: () => void = () => 0;
  rightClickHandle: () => void = () => 0;
  constructor(){
    
  }
  setCtrlContainer(elem: HTMLElement): void{
    this.htmlContainer = elem;
    this.setCtrlElem();
  }
  setCtrlElem(): void{
    this.leftCtrl = document.querySelector('.left-ctrl')
    this.rightCtrl = document.querySelector('.right-ctrl')

    this.leftCtrl.addEventListener('click', (ev) => this.leftClick(ev));
    this.rightCtrl.addEventListener('click', (ev) => this.rightClick(ev));
  }

  setLeftListener(clickListener: () => void){
    this.leftClickHandle = clickListener;
  }
  leftClick(ev: MouseEvent): void{
    this.leftClickHandle();
  }
  setRightListener(clickListener: () => void){
    this.rightClickHandle = clickListener;
  }
  rightClick(ev: MouseEvent): void{
    this.rightClickHandle();
  }
}