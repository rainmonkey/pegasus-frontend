import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';
import { environment } from 'src/environments/environment.prod';
import { ChattingService } from 'src/app/services/repositories/chatting.service';

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
  public totalNotiNum: number = 0;

  @Output() onChattingWith = new EventEmitter();

  constructor(
    private messagerService: MessagerService,
    private chattingService: ChattingService
  ) { }

  ngOnInit() {

    let that = this;
    // setInterval((that)=>{
    //   that.notiNum ++;
    //   console.log(that.notiNum)
    // },1000,that)
    this.getNotifications();
    this.getSubscribers();
  }

  getNotifications() {
    this.messagerService.staffNoti$.subscribe(
      (res: number) => { this.staffsNotiNum = res }
    )
    this.messagerService.teacherNoti$.subscribe(
      (res: number) => this.teachersNotiNum = res
    )
    this.messagerService.learnersNoti$.subscribe(
      (res: number) => this.learnersNotiNum = res
    )
    this.messagerService.totalNoti$.subscribe(
      (res: number) => this.totalNotiNum = res
    )
    this.messagerService.refreshSubs$.subscribe(
      (res) => {
        this.getSubscribers();
      }
    )

    this.messagerService.notice();
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

    this.sortSubscribersByOnlineStatus();
    //console.log(this.messagerService.userIdsOfLearners)
  }

  sortSubscribersByOnlineStatus() {
    let userList = this.chattingService.userList;
    if (userList) {
      for (let i of this.StaffList) {
        for (let j of userList) {
          if (i['UserId'] == j.UserId) {
            console.log('staff')
            let index = this.StaffList.indexOf(i);
            let obj = this.StaffList[index];
            obj['className'] = 'onlineSubs';
            this.StaffList.splice(index, 1);
            this.StaffList.unshift(obj);
          }
        }
      }
      for (let i of this.TeacherList) {
        for (let j of userList) {
          if (i['UserId'] == j.UserId) {
            console.log('teacher')
            let index = this.TeacherList.indexOf(i);
            let obj = this.TeacherList[index];
            obj['className'] = 'onlineSubs';
            this.TeacherList.splice(index, 1);
            this.TeacherList.unshift(obj);
          }
        }
      }
      for (let i of this.LearnerList) {
        for (let j of userList) {
          if (i['UserId'] == j.UserId) {
            console.log('learner')
            let index = this.LearnerList.indexOf(i);
            let obj = this.LearnerList[index];
            obj['className'] = 'onlineSubs';
            this.LearnerList.splice(index, 1);
            this.LearnerList.unshift(obj);
          }
        }
      }
    }
  }

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

  /**
   * Double click to start a new chat.
   * @param event 
   * @param subscriber 
   * @param cate 
   */
  chattingWithHandler(event, subscriber: object, cate: string) {
    //save the subscriber now chatting with.
    this.messagerService.saveSubscriberNowChattingWith(subscriber);
    this.messagerService.processNotifications(subscriber['UserId'], -1, cate)
    //fire emit to parent component to notice need view switch
    this.onChattingWith.emit(true);
  }

  /**
   * Track by function.
   * @param index 
   */
  trackByFunction(index) {
    return index;
  }
}
