import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { of, from, Subject } from 'rxjs'
import { map, filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MessagerService {
  public baseUrl: any = environment.baseUrl;
  public isSubscriberListsGotError: boolean = false;

  public subscribersNoti: object = {};
  public totalNotiNum: number = 0;
  public teachersNotiNum: number = 0;
  public teacherNoti$ = new Subject();
  public staffsNotiNum: number = 0;
  public staffNoti$ = new Subject();
  public learnersNotiNum: number = 0;
  public learnersNoti$ = new Subject();
  public subscriberChattingWith: object = {};

  constructor(private http: HttpClient) {
    console.log('messager service')
  }

  /**
   * Get user's subscriber lists from server and saved to session storage.
   * @param {number} userId - user ID 
  */
  getSubscribersList(userId: number) {
    //console.log("111")
    //To avoid dulplicated data transfer, when the web initiate, call api from server once
    //refresh, render or re-render don't call api
    if (JSON.parse(sessionStorage.getItem('chattingInit'))) {
      console.log('aaa')
      return;
    }

    this.http.get(this.baseUrl + 'Chat/GetChattingList/' + userId)
      .subscribe(
        (res) => {
          sessionStorage.setItem('chattingInit', JSON.stringify(true));
          this.saveSubscriberLists(res);
        },
        (err) => {
          this.isSubscriberListsGotError = true;
        }
      )
  }

  /**
   * save subscibers list to session storage
   * @param {object} data - object of subscribers lists
   */
  saveSubscriberLists(data: object) {
    //console.log(data)
    //store the subscirbers list in session storage
    sessionStorage.setItem('LearnerList', JSON.stringify(data['Data'].LearnerList));
    sessionStorage.setItem('StaffList', JSON.stringify(data['Data'].StaffList));
    sessionStorage.setItem('TeacherList', JSON.stringify(data['Data'].TeacherList));
  }

  /**
   * @returns {object} - return subscriber lists stored in session storage
  */
  readSubscriberLists() {
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
    this.subscriberChattingWith = subscriberObj;
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
    localStorage.setItem('customThemeIndex', theme);
  }

  /*
    get custom personl theme in local storage
  */
  getCustomizedTheme(): number {
    return JSON.parse(localStorage.getItem('customThemeIndex'));
  }

  /**
   * Processing new message incoming.
   * @param senderId - sender's ID
   * @param message - message body
   * @param createTime - create time
   * @param role - sender's role
   */
  processIncomingMessage(senderId: number, message: string, createTime: string, role: string) {

    this.simulateNotifications(1, role);

    //message object to save
    let messageObj = {
      senderId: senderId,
      messageBody: message,
      isIncomingMessage: true,
      isResend: false,
      isError: false,
      createAt: createTime
    }
    this.saveChattingHistory(messageObj);
  }

  /**
    *@param senderId - sender's userId 
    *@param imcomingNumberOfNotifications - how many notifications to simulate
    *@param role - role of sender
  */
  simulateNotifications(incomingNumberOfNotifications: number, role: string) {
    let isPass = true;
    switch (role) {
      case 'receptionist':
        this.staffsNotiNum += incomingNumberOfNotifications;
        break;
      default:
        isPass = false;
        break;
    }

    if (isPass) {
      this.totalNotiNum += incomingNumberOfNotifications;
      this.notice();
    }
  }

  notice() {
    this.learnersNoti$.next(this.learnersNotiNum);
    this.teacherNoti$.next(this.teachersNotiNum);
    this.staffNoti$.next(this.staffsNotiNum);
  }

  /*
    save chatting history
     --> save chatting messages to the local storage when user push the send button,
         but if message sent failed(async), update info of message's history (push a new message with isError prop and delete the failed message) 
  */
  saveChattingHistory(messageObj: { senderId: number, messageBody: string, isIncomingMessage: boolean, createAt: any, isError: boolean, isResend: boolean, createTimeStamp?: number }) {
    let historyKeyName = messageObj.senderId + 'History';
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
              senderId: res['subscriberId'],
              messageBody: res['message'],
              isIncomingMessage: res['leftOrRight'],
              createAt: res['createTime'],
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

  /**
   * Save connection status to session storage.
   * @param isConnected connected or not
   */
  saveConnectionStatus(isConnected) {
    sessionStorage.setItem('connectionStatus', isConnected);
  }

  /**
   * Read connection status from session storage.
   */
  readConnectionStatus() {
    return JSON.parse(sessionStorage.getItem('connectionStatus'));
  }
}
