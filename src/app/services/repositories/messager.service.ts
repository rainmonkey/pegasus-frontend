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
  public totalNoti$ = new Subject();
  public refreshSubs$ = new Subject();

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
    sessionStorage.setItem('LearnerList', JSON.stringify(data['Data'].LearnerList.map((val) => {
      val.notiNum = 0;
      return val;
    })));
    sessionStorage.setItem('StaffList', JSON.stringify(data['Data'].StaffList.map((val) => {
      val.notiNum = 0;
      return val;
    })));
    sessionStorage.setItem('TeacherList', JSON.stringify(data['Data'].TeacherList.map((val) => {
      val.notiNum = 0;
      return val;
    })));
  }

  /**
   * @param [cate] - category of list return: Staff, Teacher, Learner
   * @returns {object} - return subscriber lists stored in session storage
  */
  readSubscriberLists(cate?: string) {
    if (cate) {
      return JSON.parse(sessionStorage.getItem(cate + 'List'));
    }
    else {
      return {
        LearnerList: JSON.parse(sessionStorage.getItem('LearnerList')),
        StaffList: JSON.parse(sessionStorage.getItem('StaffList')),
        TeacherList: JSON.parse(sessionStorage.getItem('TeacherList'))
      };
    }
  }

  /**
   * Processing new message incoming.
   * @param senderId - sender's ID
   * @param message - message body
   * @param createTime - create time
   * @param role - sender's role
   */
  processIncomingMessage(senderId: number, message: string, createTime: string, role: string) {

    this.processNotifications(senderId, 1, role);

    //message object to save
    let messageObj = {
      subscriberId: senderId,
      messageBody: message,
      isIncomingMessage: true,
      isResend: false,
      isError: false,
      createAt: createTime
    }
    this.saveChattingHistory(messageObj);
  }

  /**
   * @param senderId - sender's user id
    *@param imcomingNumberOfNotifications - how many notifications to simulate
    *@param role - role of sender
  */
  processNotifications(senderId: number, incomingNumberOfNotifications: number, role: string) {
    switch (role) {
      case 'receptionist':
        this.calculateNotifications('Staff', incomingNumberOfNotifications, senderId);
        break;
      default:
        break;
    }
  }

  calculateNotifications(cate: string, notiNum: number, subscriberId?: number) {
    /**@property {number} notiNumAfterUpdate*/
    let notiNumAfterUpdate:number;
    //改变相应种类的notinum

    let msgIndex;
    let subscriberList = this.readSubscriberLists(cate);
    //filter return a new array
    let subscriber = subscriberList.filter((val, index) => {
      if (val.UserId === subscriberId) {
        msgIndex = index;
        return val;
      }
    })[0];
    if (notiNum > 0) {
      subscriber['notiNum'] += notiNum;
      notiNumAfterUpdate = notiNum;
    }
    else {
      notiNumAfterUpdate = -subscriber['notiNum'];
      subscriber['notiNum'] = 0;
    }
    // subscriberList[msgIndex] = subscriber;
    //>0 means add notification number, push this subscriber to list's top
    if (notiNum > 0) {
      subscriberList.splice(msgIndex, 1);
      subscriberList.unshift(subscriber);
    }
    else {
      subscriberList[msgIndex] = subscriber;
    }
    sessionStorage.setItem(cate + 'List', JSON.stringify(subscriberList));

    let number = this.readNotificationNumbers(cate) + notiNumAfterUpdate;
    //改变相应种类的num
    this.saveNotificationNumbers(cate, number);
    //改变total的值
    let total = this.readNotificationNumbers('Total');
    total = total? total + notiNumAfterUpdate: number;
    this.saveNotificationNumbers('Total',total);

    //推送
    this.notice();
  }

  /**
   * Read the number of notifications from session storage.
   * @param cate - categories: Teacher, Staff, Learner, Total
   */
  readNotificationNumbers(cate: string) {
    return JSON.parse(sessionStorage.getItem(cate + 'NotiNum'));
  }

  /**
   * Save the number of notifications to session storage.
   * @param cate - categories: Teacher, Staff, Learner, Total
   * @param notiNum - numbers of updated notifications
   */
  saveNotificationNumbers(cate: string, notiNum: number) {
    sessionStorage.setItem(cate + 'NotiNum', JSON.stringify(notiNum));
  }

  /**
   * Notice that the notifications changed(how many new messages incoming)
   */
  notice() {
    this.learnersNoti$.next(this.learnersNotiNum);
    this.teacherNoti$.next(this.teachersNotiNum);
    this.staffNoti$.next(this.readNotificationNumbers('Staff'));
    this.totalNoti$.next(this.readNotificationNumbers('Total'));
    this.refreshSubs$.next(true);
  }

  /**
   * Save chatting history to session storage.
   * @param messageObj - message object
   */
  saveChattingHistory(messageObj: MessageObject) {
    let key = messageObj.subscriberId + 'History';
    //push new message if history exist
    if (sessionStorage.getItem(key)) {
      let historyObj = JSON.parse(sessionStorage.getItem(key));

      //if error or resend
      if (messageObj.isError || messageObj.isResend) {
        let errorMessageIndex;
        historyObj.filter((item, index) => {
          if (item.createTimeStamp == messageObj.createTimeStamp) {
            errorMessageIndex = index;
            return true;
          }
        }, errorMessageIndex);
        //update message
        historyObj[errorMessageIndex] = messageObj;
      }
      //if normal message, just push it to local storage
      else {
        historyObj.push(messageObj);
      }
      sessionStorage.setItem(key, JSON.stringify(historyObj));
    }

    //create a new history if not exist
    else {
      sessionStorage.setItem(key, JSON.stringify([messageObj]));
    }
  }

  /**
   * Read chatting history from session storage.
   * @param subscriberUserId - subscriber's Id as key
   * @param messageIndex - message index, to get a specific message
   */
  readChattingHistory(subscriberUserId: number, messageIndex?: number) {
    let key = subscriberUserId + 'History';
    let history = JSON.parse(sessionStorage.getItem(key));
    if (messageIndex) {
      return history[messageIndex];
    }
    else {
      return history;
    }
  }

  /**
   * When message send failed, handle it.
   * @param timeStamp - time stamp of message create
   * @param subscriberUserId - subscriber's Id
   */
  sendMessageFailed(timeStamp: number, subscriberUserId: number) {
    let localChattingHistory$ = from(this.readChattingHistory(subscriberUserId)).pipe(
      //find failed message
      filter(i => i['createTimeStamp'] == timeStamp)
    )
      .subscribe(
        (res: MessageObject) => {
          if (res) {
            //mark it as error
            res['isError'] = true;
            this.saveChattingHistory(res);
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

  /*
   save the subscriber's object now chatting in session storage 
 */
  saveSubscriberNowChattingWith(subscriber) {
    let subscriberStr = JSON.stringify(subscriber);
    sessionStorage.setItem('subscriberChattingWith', subscriberStr);
    this.saveRecentSubscribers(subscriber);
  }

  /**
   * Read from session storage to get the subscriber that user now chatting with.
   */
  readSubscriberNowChattingWith() {
    return JSON.parse(sessionStorage.getItem('subscriberChattingWith'));
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

}

export interface MessageObject {
  subscriberId: number,
  messageBody: string,
  isIncomingMessage: boolean,
  createAt: any,
  isError: boolean,
  isResend: boolean,
  createTimeStamp?: number
}
