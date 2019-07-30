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

  /**@property {number} - get modal's height, too stupid, simplify it after learned SASS */
  @Input() modalHeight: number;
  @Output() onStartChatting = new EventEmitter();
  @ViewChild('m_c_text_area') textArea;

  constructor(
    private messagerService: MessagerService,
    private chattingService: ChattingService
  ) { }

  ngOnInit() {
    this.getSubscriberNowChattingWith();
  }

  /**
   * Get subscriber now chatting.
   */
  getSubscriberNowChattingWith() {
    this.subscriber = this.messagerService.readSubscriberNowChattingWith();
  }

  /**
   * Keys down event handler, press control and enter to send message.
   * @param event - key's down event
   */
  keysDownEventHandler(event) {
    this.saveMessageToLocal(event.target.value);
    this.clearInputArea();
  }

  /**
   * Clear input area.
   */
  clearInputArea() {
    this.textArea.nativeElement.value = '';
  }

  /**
   * Scroll the scroll bar to bottom.
   * @param counter - counter of chatting messages
   */
  scrollToBottom(counter) {
    //if counter changed(that means new messages pushed on the view, scrolled to bottom, to avoid *ngFor automatically checking
    if (counter !== this.chattingAreaMessageCounter) {
      document.getElementById('scroll_anchor').scrollIntoView();
    }
    this.chattingAreaMessageCounter = counter;
  }

  /**
   * Save messages history.
   * @param messageBody - message content
   */
  saveMessageToLocal(messageBody:string) {
    console.log(messageBody)
    if (messageBody) {
      let createAt = new Date();
      let messageObj = {
        subscriberId: this.subscriber['UserId'],
        messageBody: messageBody,
        isIncomingMessage: false,
        isError: false,
        createAt:  new Date(),
        isResend: false,
        createTimeStamp: createAt.getTime()
      }

      this.messagerService.saveChattingHistory(messageObj);
      this.sendMessageToServer(messageBody, createAt);
    }
  }

 /**
  * Send message to server with SignalR.
  * @param messageBody - message content to send
  * @param createAt - create time
  */
  sendMessageToServer(messageBody, createAt) {
    let messageObj = {
      ReceiverUserId: this.subscriber['UserId'],
      SenderUserId: Number(localStorage.getItem('userID')),
      MessageBody: messageBody,
      ChatGroupId: null,
    }

    this.chattingService.sendMessageOneToOne(messageObj)
      .subscribe(
        null,
        (err) => {
          console.log('message sent error')
          //message send failed handler
          this.messagerService.sendMessageFailed(createAt.getTime(), this.subscriber['UserId']);
        }
      )
  }

  /**
   * Get chatting history List.
   * @return - chatting history list
   */
  getChattingHistory() {
    return this.messagerService.readChattingHistory(this.subscriber['UserId']);
  }

  /**
   * Return to main menu to start a new chatting if no subscriber selected.
   */
  startNewChatting() {
    this.onStartChatting.emit(false);
  }

 /**
  * Resend message when user click resend button.
  * @param event - template event
  * @param messageIndex - message index
  */
  resentMessage(event, messageIndex) {
    let msg = this.messagerService.readChattingHistory(this.subscriber['UserId'], messageIndex);
    //set isError as false
    msg.isError = false;
    //set isResend as true
    msg.isResend = true;
    let createAt = new Date(msg['createTimeStamp'])
    this.messagerService.saveChattingHistory(msg);
    //resend message   
    this.sendMessageToServer(msg['messageBody'], createAt);
  }

  /**
   * Emoji picker display handler.
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

  /**
   * Display photos.
   * @param isIncomingMessage - is incoming message?
   */
  showPhotoIcon(isIncomingMessage: boolean) {
    let src = isIncomingMessage ? this.photoUrl + this.subscriber['Photo'] : this.photoUrl + localStorage.getItem('photo');
    return src;
  }

}
