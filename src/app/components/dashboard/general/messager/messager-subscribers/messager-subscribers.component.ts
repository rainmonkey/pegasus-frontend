import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-messager-subscribers',
  templateUrl: './messager-subscribers.component.html',
  styleUrls: ['./messager-subscribers.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css'],
  animations: [Animations.switchGroupAnimation]
})
export class MessagerSubscribersComponent implements OnInit {
  public groupChatSwitchFlag: boolean = true;
  public TeacherList: Array<object>;
  public LearnerList: Array<object>;
  public StaffList: Array<object>;
  public notiNum = 0;
  public photoUrl: any = environment.photoUrl;
  public teachersNotiNum: number = 0;
  public staffsNotiNum: number = 0;
  public learnersNotiNum: number = 0;

  @Output() onChattingWith = new EventEmitter();

  constructor(private messagerService: MessagerService) {

  }

  ngOnInit() {

    let that = this;
    // setInterval((that)=>{
    //   that.notiNum ++;
    //   console.log(that.notiNum)
    // },1000,that)
    this.getSubscribers();
    
    this.messagerService.staffNoti$.subscribe(
      (res:number)=> {this.staffsNotiNum = res;
      console.log(res)}
    )
    this.messagerService.teacherNoti$.subscribe(
      (res:number)=>this.teachersNotiNum = res
    )
    this.messagerService.learnersNoti$.subscribe(
      (res:number)=>this.learnersNotiNum = res
    )
  }

  /*
    get subscribers from storage
      -->in order to read, still put the storage data getting in service.
  */
  getSubscribers() {
    let subscribers = this.messagerService.readSubscriberLists();
    let { StaffList, TeacherList, LearnerList } = subscribers;

    this.StaffList = StaffList;
    this.TeacherList = TeacherList;
    this.LearnerList = LearnerList;
    //console.log(this.messagerService.userIdsOfLearners)
  }

  // getDefaultNotifications(){
  //   let {teachersNotiNum,staffsNotiNum,learnersNotiNum}  = this.messagerService.getDefaultNotifications();
  //   console.log(teachersNotiNum)
  //   this.teachersNotiNum = teachersNotiNum;
  //   this.staffsNotiNum = staffsNotiNum;
  //   this.learnersNotiNum =learnersNotiNum;
  // }

  /*
    switch between subscribers and group chat
  */
  changeChattingGroup(event, commandId) {
    if (commandId == 0) {
      this.groupChatSwitchFlag = true;
    }
    else if (commandId == 1) {
      this.groupChatSwitchFlag = false;
    }
  }

  /*
    When user click group label, show subscribers in this group
  */
  displayGroup(event, whichGroup) {
    let groupObj = document.getElementById(whichGroup);
    if (groupObj.style.display == '' || groupObj.style.display == 'none') {
      groupObj.style.display = 'block';
    }
    else {
      groupObj.style.display = 'none';
    }
  }

  /*
    double click to start a new chatting
  */
  chattingWithHandler(event, subscriber) {
    //save the subscriber now chatting with.
    this.messagerService.saveSubscriberChattingWith(subscriber);
    //fire emit to parent component to notice need view switch
    this.onChattingWith.emit(true);
  }

  getNotifications(subsciberUserId) {
    //console.log(subsciberUserId)
  }

}
