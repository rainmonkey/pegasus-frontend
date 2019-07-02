import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChattingService } from 'src/app/services/repositories/chatting.service';

@Component({
  selector: 'app-messager-subscribers',
  templateUrl: './messager-subscribers.component.html',
  styleUrls: ['./messager-subscribers.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']
})
export class MessagerSubscribersComponent implements OnInit {
  public groupChatSwitchFlag: boolean = true;
  public subsOfTeacher:Array<object>;
  public subsOfStudents: Array<object>;
  public subsOfStaffs:Array<object>;

  @Output() onChattingWith = new EventEmitter();

  constructor(private chattingService:ChattingService) { }

  ngOnInit() {
   this.getSubscribers();
  }

  /*
    get subscribers from storage
      -->in order to read, still pull the storage data getting in service.
  */
  getSubscribers(){
    let subscribers = this.chattingService.getSubscribers();
    console.log(subscribers)
    this.subsOfStaffs = subscribers.Item1;
    this.subsOfTeacher = subscribers.Item2;
    this.subsOfStudents = subscribers.Item3;
  }

  /*
    switch between subscribers and group chat
  */
  changeChattingGroup(event,commandId) {
    if(commandId == 0){
      this.groupChatSwitchFlag = true;
    }
    else if(commandId == 1){
      this.groupChatSwitchFlag = false;
    }
  }

  /*
    When user click group label, show subscribers in this group
  */
  displayGroup(event,whichGroup){
    console.log('aaa')
    let groupObj = document.getElementById(whichGroup);
    if(groupObj.style.display == '' || groupObj.style.display == 'none'){
      groupObj.style.display = 'block';
    }
    else{
      groupObj.style.display = 'none';
    }
  }

  /*
    点击选择和谁聊天
  */
  chattingWithHandler(event,subscriber){
    
    //在sessionStorage里面保存 正在聊天的人
    let subscribersStr = JSON.stringify(subscriber);
    sessionStorage.setItem('user',subscribersStr);
    this.onChattingWith.emit({"status":true,"user":subscribersStr})
  }

}
