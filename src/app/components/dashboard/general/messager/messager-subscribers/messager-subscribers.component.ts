import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';

@Component({
  selector: 'app-messager-subscribers',
  templateUrl: './messager-subscribers.component.html',
  styleUrls: ['./messager-subscribers.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css'],
  animations:[Animations.switchGroupAnimation]
})
export class MessagerSubscribersComponent implements OnInit {
  public groupChatSwitchFlag: boolean = true;
  public subsOfTeacher:Array<object>;
  public subsOfStudents: Array<object>;
  public subsOfStaffs:Array<object>;
  public notiNum = 0;

  @Output() onChattingWith = new EventEmitter();

  constructor(private messagerService:MessagerService) { }

  ngOnInit() {
    let that = this;
    // setInterval((that)=>{
    //   that.notiNum ++;
    //   console.log(that.notiNum)
    // },1000,that)
   this.getSubscribers();
  }

  /*
    get subscribers from storage
      -->in order to read, still put the storage data getting in service.
  */
  getSubscribers(){
    let subscribers = this.messagerService.getSubscribers();
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
    let groupObj = document.getElementById(whichGroup);
    if(groupObj.style.display == '' || groupObj.style.display == 'none'){
      groupObj.style.display = 'block';
    }
    else{
      groupObj.style.display = 'none';
    }
  }

  /*
    double click to start a new chatting
  */
  chattingWithHandler(event,subscriber){
    //save the subscriber now chatting with.
    this.messagerService.saveSubscriberChattingWith(subscriber);
    //fire emit to parent component to notice need view switch
    this.onChattingWith.emit(true);
  }

}
