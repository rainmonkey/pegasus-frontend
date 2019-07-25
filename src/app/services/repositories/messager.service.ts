import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { of, from } from 'rxjs'
import { map, filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MessagerService {
  public baseUrl: any = environment.baseUrl;
  // public subsOfStaffs;
  // public subsOfTeachers;
  // public subsOfStudents;
  public errorFlag: boolean;

  public userIdsOfTeachers: object;
  public userIdsOfStaffs: object;
  public userIdsOfLearners: object;


  constructor(private http: HttpClient) {
    console.log('messager service')
  }

  //get subscribers list from server
  getSubscribersList(userId) {
    console.log("111")
    //To avoid dulplicated data transfer, when the web initiate, call api from server once
    //refresh, render or re-render don't call api
    if (sessionStorage.chattingInit == 'true') {
      return;
    }
    else {
      this.http.get(this.baseUrl + 'Chat/GetChattingList/' + userId)
        .subscribe(
          (res) => {
            let LearnerList = res['Data'].LearnerList.map(val => this.subscribersMap(val, 0));
            let StaffList = res['Data'].StaffList.map(val => this.subscribersMap(val, 1));
            let TeacherList = res['Data'].TeacherList.map(val => this.subscribersMap(val, 2));

            //store the subscirbers list in session storage
            sessionStorage.setItem('LearnerList', JSON.stringify(LearnerList));
            sessionStorage.setItem('StaffList', JSON.stringify(StaffList));
            sessionStorage.setItem('TeacherList', JSON.stringify(TeacherList));
            //set 'true' as a sign
            sessionStorage.setItem('chattingInit', 'true');
          },
          (err) => {
            //console.log(err)
            this.errorFlag = true;
          }
        )
    }
  }

  /*
    @param: val: value to map  
            groupIndex: groups 0:Learners  1:Staffs  2:Teachers
  */
  subscribersMap(val, groupIndex) {
    val.newMessage = 0;
    let userId = val.UserId;
    console.log(userId)
    // switch (groupIndex) {
    //   case 0:
    //     this.userIdsOfLearners.userId = val.UserId;
    //   case 1:
    //     this.userIdsOfStaffs.userId = val.UserId;
    //   case 2:
    //     this.userIdsOfTeachers.userId = val.UserId;
    // }
    console.log(this.userIdsOfLearners)
    return val;
  }

  /*
    return the subscribers stored in local session storage,
      -->为了代码整洁 把从sessionStorage里面获取数据放在了service里面
  */
  getSubscribers() {
    return {
      LearnerList: JSON.parse(sessionStorage.getItem('LearnerList')),
      StaffList: JSON.parse(sessionStorage.getItem('StaffList')),
      TeacherList: JSON.parse(sessionStorage.getItem('TeacherList'))
    };
  }

  /*
    save the subscriber's object now chatting in session storage 
  */
  saveSubscriberChattingWith(subscriber) {
    let subscriberStr = JSON.stringify(subscriber);
    sessionStorage.setItem('subscriberChattingWith', subscriberStr);
    this.saveRecentSubscribers(subscriber);
  }

  /*
    get the subscriber's now chatting Object from session storage
  */
  getSubscriberChattingWith() {
    let subscriberObj = sessionStorage.getItem('subscriberChattingWith') ? JSON.parse(sessionStorage.getItem('subscriberChattingWith')) : null;
    return subscriberObj;
  }

  /*
    save the recent subscribers in session storage
  */
  saveRecentSubscribers(subscriberObj) {
    let userId = subscriberObj.UserId;
    let array: string = sessionStorage.getItem('recentlySubscriberArray')
    let arrayObj = array ? JSON.parse(array) : [];

    //if subscriber already exist, remove it and add it to the array as 1st
    let index = arrayObj.findIndex(item => item.UserId === userId);
    if (index !== -1) {
      arrayObj.splice(index, 1);
    }
    arrayObj.unshift(subscriberObj);

    //if number of rencently suibscribers > 10, remove the last one
    if (arrayObj.length > 10) {
      arrayObj.pop();
    }

    sessionStorage.setItem('recentlySubscriberArray', JSON.stringify(arrayObj));
  }

  /*
    get the recent subscribers from session storage
  */
  getRecentSubscribers() {
    return JSON.parse(sessionStorage.getItem('recentlySubscriberArray'));
  }

  /*
    save custom personl theme in local storage
  */
  saveCustomizedTheme(theme) {
    localStorage.setItem('themeIndex', theme);
  }

  /*
    get custom personl theme in local storage
  */
  getCustomizedTheme() {
    return localStorage.getItem('themeIndex');
  }

  /*
    save chatting history
     --> save chatting messages to the local storage when user push the send button,
         but if message sent failed(async), update info of message's history (push a new message with isError prop and delete the failed message) 
  */
  saveChattingHistory(messageObj: { subscriberId: number, message: string, leftOrRight: string, createTime: any, isError: boolean, isResend: boolean, createTimeStamp?: number }) {
    let historyKeyName = messageObj.subscriberId + 'History';
    //messageObj.createTime = messageObj.createTime.toLocaleString();
    //if histroy exist with a subscriber, push new message to local storage
    if (sessionStorage.getItem(historyKeyName)) {
      let historyObj = JSON.parse(sessionStorage.getItem(historyKeyName));

      //message sent failed or resend handler
      //if any message sent failed or resend, update message info to failed status
      if (messageObj.isError || messageObj.isResend) {
        //@param: index of failed message
        let failedIndex;
        //get the index of failed message
        historyObj.filter((item, index) => {
          if (item.createTimeStamp == messageObj.createTimeStamp) {
            failedIndex = index;
            return true;
          }
        }, failedIndex);
        //update message info to failed status
        historyObj[failedIndex] = messageObj;
      }
      //if normal message, just push it to local storage
      else {
        historyObj.push(messageObj);
      }
      sessionStorage.setItem(historyKeyName, JSON.stringify(historyObj));
    }

    //if history of a subscriber does not exist, create a new one
    else {
      sessionStorage.setItem(historyKeyName, JSON.stringify([messageObj]));
    }
  }

  getChattingHistory(subscriberUserId) {
    let historyKeyName = subscriberUserId + 'History';
    if (sessionStorage.getItem(historyKeyName)) {
      return JSON.parse(sessionStorage.getItem(historyKeyName));
    }
    else {
      return [];
    }
  }

  /*
    find a specific message with index
  */
  getSpecificChattingMessageHistory(subscriberUserId, index) {
    let history = this.getChattingHistory(subscriberUserId);
    return history[index];
  }
  /*
    @timeStamp: message sent time stamp, use it as the key in chatting history.
  */
  messageSendFailedHandler(timeStamp, subscriberUserId) {
    let localChattingHistory$ = from(this.getChattingHistory(subscriberUserId)).pipe(
      filter(i => i['createTimeStamp'] == timeStamp)
    )
      .subscribe(
        (res) => {
          if (res) {
            let obj = {
              subscriberId: res['subscriberId'],
              message: res['message'],
              leftOrRight: res['leftOrRight'],
              createTime: res['createTime'],
              isError: true,
              isResend: false,
              createTimeStamp: res['createTimeStamp']
            }
            //@params: message object
            this.saveChattingHistory(obj);
          }
        }
      )
  }
}
