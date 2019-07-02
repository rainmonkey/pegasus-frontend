import { Component, OnInit } from '@angular/core';
import { ChattingService } from 'src/app/services/repositories/chatting.service';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = false;
  public initiateFlag = false;
  public browserHeight:number;

  constructor(private chattingSerice:ChattingService) { }

  ngOnInit() {
    //获得浏览器高度
    this.browserHeight = window.outerHeight;

    //sent get subscribers request
    this.chattingSerice.getSubscribersList(1);
    //发送请求 看看有没有未读消息 【未完成】

    //如果有未读消息
    this.unreadMsgHandler();

  }
  
  unreadMsgHandler(){
    
  }

  /*
    display messager chatting component
      --> when user click messager icon, display component 
  */
  displayMessager(){
    this.popUpModalFlag = true;
  }

  /*
    hide messager chatting component
      --> when user click close sign, hide component 
  */
  hideMessager(event){
    if(event == 'true'){
      this.popUpModalFlag = false;
    }
  }

}
