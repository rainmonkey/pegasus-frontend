import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css'],
  animations: [Animations.unReadMessage]
})
export class MessagerIconComponent implements OnInit {
  public isModalDisplayed: boolean = false;
  //animation trigger
  public notificationsTrigger: boolean = false;
  public interval: any;
  public totalNotiNum: number = 0;
  constructor(
    private messagerService: MessagerService,
    private chattingService: ChattingService
  ) { }

  ngOnInit() {
    //send request to server to get the subscribers lists
    this.messagerService.getSubscribersList(1);
    //build a chatting connection
    this.chattingService.startConnection(localStorage.userID);
    //发送请求 看看有没有未读消息 把未读消息存到数据库 【未完成】
    this.messagerService.totalNoti$.subscribe(
      (res:number) =>{
        this.totalNotiNum = res;
      }
    )
    this.messagerService.notice();
    //如果有未读消息
  }

  /**
   * Notification's animation handler.
   * @param state - State of nitifications. 
   * true: have notifications  false: no notifications
   */
  notificationAnimationHandler(state: boolean) {
    if (state) {
      this.interval = setInterval(() => {
        this.notificationsTrigger = !this.notificationsTrigger;
      }, 10000)
    }
    else {
      this.interval.clearInterval();
    }
  }

  /**
   * Display messager modal when messager icon clicked.
   */
  displayMessagerModal() {
    console.log(this.chattingService.isReady)
    if(this.chattingService.isReady){
      console.log('aaa')
      this.isModalDisplayed = true;
    }
    else{
      return
    }
    //this.notificationAnimationHandler(false);
  }

  /**
   * Close messager modal when close icon clicked. 
   * @param event - param emiter from child component, close modal if true
   */
  closeMessagerModal(event: boolean) {
    this.isModalDisplayed = !event;
  }
}
