import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css'],
  animations: [Animations.unReadMessage]
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = false;
  //animation state
  public unReadAnimationStatus: boolean = false;
  //pass to child component, browser's height
  public browserHeight: number;
  public msgNotificationTimer;

  constructor(private messagerService: MessagerService,
    private chattingService: ChattingService) { }

  ngOnInit() {
    //get browser's height, chatting modal can resize in diffrent browsers
    this.browserHeight = window.outerHeight;
    //sent get subscribers request
    this.messagerService.getSubscribersList(1);
    //build a chatting connection
    this.chattingService.startConnection(localStorage.userID);
    //发送请求 看看有没有未读消息 把未读消息存到数据库 【未完成】
    //if(sessionStorage.getItem('chattingInit'))
    //如果有未读消息或者有新消息 但是聊天框最小化了
    this.setMessageNoticeAnimationState();

  }

  /*
    set message notice animation state.
  */
  setMessageNoticeAnimationState() {
    let that = this;
    this.msgNotificationTimer = setInterval(function (that) {
      that.unReadAnimationStatus = !that.unReadAnimationStatus;
    }, 500, that)
  }

  /*
    display messager chatting component
      --> when user click messager icon, display component 
  */
  displayMessager() {
    this.unReadAnimationStatus = false;
    clearInterval(this.msgNotificationTimer);
    this.popUpModalFlag = true;
  }

  /*
    close messager chatting component
      --> when user click close sign, hide component 
  */
  hideMessager(event) {
    if (event == 'true') {
      this.popUpModalFlag = false;
    }
  }

}
