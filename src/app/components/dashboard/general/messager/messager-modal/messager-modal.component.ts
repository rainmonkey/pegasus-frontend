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
  public preBtnSelectedObj: any = null;
  public userId = null;
  public bgUrl:string = null;
  public bgColor:string = null;
  public styleList:Array<object>=[
                                  {url:'../../../../../../assets/images/shared/background01.jpg',background:'linear-gradient(135deg, pink, white)',bgcolor:'#fadbe3'},
                                  {url:'../../../../../../assets/images/shared/background03.jpg',background:'linear-gradient(135deg, lightgreen, lightblue)',bgcolor:'#a6ddd3'},
                                  {url:'../../../../../../assets/images/shared/background04.jpg',background:'linear-gradient(135deg, black, white)',bgcolor:'#2a2a2a'},
                                  {url:'../../../../../../assets/images/shared/background05.jpg',background:'linear-gradient(135deg, red, lightblue)',bgcolor:'#a2bcb9'},
                                  {url:'../../../../../../assets/images/shared/background06.jpg',background:'linear-gradient(135deg, lightblue, pink)',bgcolor:'#add8e6'}];


  @Output() onCloseChattingModal = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log('aaaaaaa')
    //各种初始化 未完成
    this.preBtnSelectedObj = document.getElementById('initSelected');
    console.log(sessionStorage)
    console.log(sessionStorage.name)//undefined
  }

  a() {
    return { "height": "300px" }
  }

  //点击设置按钮
  showConfigPanel(){
    let obj = document.getElementsByClassName('m_m_style')[0];
    if(obj['style'].display == '' || obj['style'].display == 'none'){
      obj['style'].display = 'block';
    }
    else{
      obj['style'].display = 'none';
    }
  }

  changeStyle(index){
    this.bgUrl = this.styleList[index]['url'];
    this.bgColor = this.styleList[index]['bgcolor'];
    //向后台发送更新的数据 未完成
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

  /*
    选择聊天对象后 跳转到聊天界面
  */
  startChattingWith(event?) {
    console.log(event)
    if (event !== undefined) {
      //如果双击跟某人聊天 接收到指令
      if (event.status == true) {
        this.selectFunctionalBtn(2);
      }
      this.userId = event.userId;
    }
    else{
      console.log('a')
      this.selectFunctionalBtn(0);
    }
  }

  closeChattingModal() {
    this.onCloseChattingModal.emit('true');
  }

}
