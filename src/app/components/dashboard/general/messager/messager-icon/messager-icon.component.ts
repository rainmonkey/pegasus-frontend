import { Component, OnInit } from '@angular/core';
import { ChattingService } from 'src/app/services/repositories/chatting.service';
import { Animations } from '../../../../../../animation/chatting-animation';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css'],
  animations: [Animations.unReadMessage]
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = false;
  public initiateFlag = false;
  public browserHeight:number;
  public unReadAnimationStatus:boolean = false;
  public msgNotificationTimer;

  constructor(private chattingSerice:ChattingService) { }

  ngOnInit() {
    //get browser's height, chatting modal can resize in diffrent browsers
    this.browserHeight = window.outerHeight;
    //sent get subscribers request
    this.chattingSerice.getSubscribersList(1);
    //发送请求 看看有没有未读消息 把未读消息存到数据库 【未完成】
    //if(sessionStorage.getItem('chattingInit'))
    //如果有未读消息或者有新消息 但是聊天框最小化了
    this.unreadMsgHandler();

  }
  
  unreadMsgHandler(){
    let that = this;
    this.msgNotificationTimer = setInterval(function(that){
      that.unReadAnimationStatus = !that.unReadAnimationStatus;
    },500,that)
  }

  /*
    display messager chatting component
      --> when user click messager icon, display component 
  */
  displayMessager(){
    clearInterval(this.msgNotificationTimer);
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
