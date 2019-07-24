import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as Emoji from 'node-emoji/'
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';
import { environment } from 'src/environments/environment.prod';

@Component({
    
  selector: 'app-messager-chatting',
  templateUrl: './messager-chatting.component.html',
  styleUrls: ['./messager-chatting.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css'],
  animations: [Animations.emojiPickerPanelDisplayAnimation]
})

export class MessagerChattingComponent implements OnInit {
  public chattingDisplayFlag: boolean = false;
  public emojiPickerDisplayFlag: boolean = false;
  //public localMsgHistroy: Array<object> = [];
  public subscriber: object;
  //url to get photos
  public photoUrl = environment.photoUrl;
  //how many messagers in current chatting panel 
  public chattingAreaMessageCounter: number = 0;

  //得到组件的高度 这种写法很傻逼 学会SASS再优化
  @Input() modalHeight;
  @Output() onStartChatting = new EventEmitter();
  @ViewChild('m_c_text_area') textArea;

  constructor(
    private messagerService: MessagerService,
    private chattingService: ChattingService
  ) { }

  ngOnInit() {
    this.getSubscriberChattingWith();
  }

  /*
    get subscriber now chatting
      --> subObj:true   chatting with a subscriber
          subObj:false  no one selected
  */
  getSubscriberChattingWith() {
    let subObj = this.messagerService.getSubscriberChattingWith();
    if (subObj) {
      this.chattingDisplayFlag = true;
      this.subscriber = subObj;
    }
    else {
      this.chattingDisplayFlag = false;
    }
  }

  /*
    called by template event 
    keys combination(control + enter) to send message
  */
  keysDownEventHandler(event) {
    this.saveMessageToLocal(event.target.value);
    this.clearInputArea();
  }

  /*
    clear input area
  */
  clearInputArea() {
    this.textArea.nativeElement.value = '';
  }

  /*
    called by template event
    scroll scroll bar to bottom
      --> if messages are too many to show the scroll bar, when push a new message, scroll to this new message
  */
  scrollToBottom(count) {
    //if counter changed(that means new messages pushed on the view), scrolled to bottom, to avoid *ngFor automatically checking
    if (!(count == this.chattingAreaMessageCounter)) {
      document.getElementById('scroll_anchor').scrollBy();
    }
    this.chattingAreaMessageCounter = count;
  }

  /*
    save the message to local storage
  */
  saveMessageToLocal(message) {
    if (message !== '') {
      //message create time
      let createAt = new Date();

      let messageObj = {
        subscriberId: this.subscriber['UserId'],
        message: message,
        leftOrRight: 'right',
        isError: false,
        createTime: createAt,
        isResend: false,
        createTimeStamp: createAt.getTime()
      }

      this.messagerService.saveChattingHistory(messageObj);
      this.sendMessageToServer(message, createAt);
    }
  }

  /*
    send message to server 这一步应该后台来完成,没必要放在前台
  */
  sendMessageToServer(messageToSend, createAt) {
    console.log(createAt)
    let messageObj = {
      ReceiverUserId: this.subscriber['UserId'],
      SenderUserId: Number(localStorage.getItem('userID')),
      MessageBody: messageToSend,
      ChatGroupId: null
    }

    this.chattingService.sendMessage(messageObj)
      .subscribe(
        null,
        (err) => {
          console.log('message sent error')
          //message send failed handler
          this.messagerService.messageSendFailedHandler(createAt.getTime(), this.subscriber['UserId']);
        }
      )
  }

  /*
    get chatting history from service
  */
  getChattingHistory() {
    return this.messagerService.getChattingHistory(this.subscriber['UserId']);
  }

  /*
    called by template event
    if no subscriber selected and now click chatting icon
  */
  startNewChatting() {
    this.onStartChatting.emit(false)
  }

  /*
    called by template event
    message send failed handler
  */
  resentMessage(event, index) {
    console.log('???')
    //get the failed message object from storage 
    let msg = this.messagerService.getSpecificChattingMessageHistory(this.subscriber['UserId'], index);
    //set isError to false
    msg.isError = false;
    //set isResend to true
    msg.isResend = true;
    let createAt = new Date(msg['createTimeStamp'])
    //save(update) resend message to storage
    this.messagerService.saveChattingHistory(msg);
    //resend to subscriber   
    this.sendMessageToServer(msg['message'], createAt);
  }

  /*
    called by tempalte event
    display/hide emoji picker panel
  */
  displayEmojiPicker() {
    this.emojiPickerDisplayFlag = !this.emojiPickerDisplayFlag;
  }

  /*
    emoji click handler
      -->when user click a specific emoji, add it to text area
  */
  emojiClickEventHandler(event) {
    //get emoji icon selected
    let emoji = Emoji.get(event.emoji.colons);
    //get emoji icon length in unicode
    let emojiLength = emoji.length;
    //get cursor position index
    let cursorStartIndex = this.textArea.nativeElement['selectionStart'];
    //add emoji icon after cursor position
    this.textArea.nativeElement['value'] = this.insertStr(this.textArea.nativeElement['value'], emoji, cursorStartIndex);
    //set new cursor position
    this.setCursorPosition(this.textArea.nativeElement, cursorStartIndex + emojiLength);
  }

  /*
   insert a sub-string to an exist string at a specific position
  */
  insertStr(strToBeInsert, strToInsert, startIndex) {
    return strToBeInsert.slice(0, startIndex) + strToInsert + strToBeInsert.slice(startIndex);
  }

  /*
    获取插入表情后的光标位置 可通用
      -->插入表情后特么的输入框失去焦点/失去光标 如果不重新设定光标 那么就从begaining开始插入
  */
  setCursorPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  showPhotoIcon(leftOrRight) {
    let src = (leftOrRight == 'left') ? this.photoUrl + this.subscriber['Photo'] : this.photoUrl + localStorage.getItem('photo');
    return src;
  }

}
