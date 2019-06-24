import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-messager-modal',
  templateUrl: './messager-modal.component.html',
  styleUrls: ['./messager-modal.component.css']
})
export class MessagerModalComponent implements OnInit {
  //数组里的顺序和名字要和HTML里的一致
  public functionalBtnNames: Array<string> = ['subscribers', 'recently', 'chatting'];
  public currentBtnIndex: number = 0;
  public personalLabelDisplayFlag: boolean = true;
  public preBtnSelectedObj:any = null;
  
  
  @Output() onCloseChattingModal = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.preBtnSelectedObj = document.getElementById('initSelected');
  }

  a(){
    return {"height":"300px"}
  }
  selectFunctionalBtn(selectId) {
    //如果点击的是当前页的btn 则不发生任何事情
    if (selectId == this.currentBtnIndex) {
      return;
    }
    else {
      this.currentBtnIndex = selectId;
      if (selectId == 2) {
        this.personalLabelDisplayFlag = false;
      }
      else {
        this.personalLabelDisplayFlag = true;
      }
      for (let i in this.functionalBtnNames) {
        if (selectId == i) {
          let selectObj = document.getElementById(this.functionalBtnNames[i]);
          selectObj.style.display = 'block';
        }
        else {
          let otherObj = document.getElementById(this.functionalBtnNames[i]);
          otherObj.style.display = 'none';
        }
      }
    }
  }

  startChattingWith(event){
    console.log(event);
    //如果双击跟某人聊天 接收到指令
    if(event.status == true){
      this.selectFunctionalBtn(2);
    }
  }

  closeChattingModal() {
    this.onCloseChattingModal.emit('true');
  }

}
