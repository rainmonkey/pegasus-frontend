import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as Emoji from 'node-emoji/'
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { Animations } from '../../../../../../animation/chatting-animation';
import * as moment from 'moment';
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
  public keysCombination: object = { "Enter": false, "Control": false };
  //public localMsgHistroy: Array<object> = [];
  public subscriber: object;
  public photoUrl = environment.photoUrl;
  public userPhoto;
  //how many messagers in current chatting panel 
  public chattingAreaMessageCounter:number = 0;
  @Input() modalHeight;
  @Output() onStartChatting = new EventEmitter();
  @ViewChild('m_c_text_area') textArea;
  constructor(private messagerService: MessagerService,
    private chattingService:ChattingService) { }
  ngOnInit() {
    this.getSubscriberChattingWith();
  }

  /*
    get subscriber now chatting
      --> subObj:true   chatting with a subscriber
          subOnj:false  no one selected
  */
  getSubscriberChattingWith() {
    let subObj = this.messagerService.getSubscriberChattingWith();
    if (subObj) {
      this.chattingDisplayFlag = true;
      this.subscriber = subObj;
      console.log(this.subscriber)
    }
    else {
      this.chattingDisplayFlag = false;
    }
  }

  /*
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

  /*
    键盘组合键发送消息
  */
  keysDownEventHandler(event) {
    if (event.key == 'Enter' || event.key == 'Control') {
      this.keysCombination[event.key] = true;
    }
    else {
      return
    }
    //当ctrl和enter同时按下的时候发送消息
    if (this.keysCombination['Enter'] == true && this.keysCombination['Control'] == true) {
      //this.pushMessageToView(event.target.value);
      //this.scrollToBottom();
      this.saveMessageToLocal(event.target.value);
      this.clearInputArea();
    }
  }

  /*
    keys up event handler
  */
  keysUpEventHanlder(event) {
    if (event.key == 'Enter' || event.key == 'Control') {
      this.keysCombination[event.key] = false;
    }
  }

  /*
    clear input area
  */
  clearInputArea() {
    this.textArea.nativeElement.value='';
  }

  /*
    scroll scroll bar to bottom
      --> if messages are too many to show the scroll bar, when push a new message, scroll to this new message
  */
  scrollToBottom(count) {
    //if counter changed, scrolled to bottom, to avoid *ngFor automatically checking
    if(!(count == this.chattingAreaMessageCounter)){
      document.getElementById('scroll_anchor').scrollIntoView();
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
        subscriberId:this.subscriber['UserId'],
        message:message,
        leftOrRight:'right',
        isError:false,
        createTime:createAt.toLocaleString(),
        createTimeStamp:createAt.getTime()
      }

      this.messagerService.saveChattingHistory(messageObj);
      this.sendMessageToServer(message,createAt);
    }
  }

  /*
    send message to server 这一步应该后台来完成,没必要放在前台
  */
  sendMessageToServer(messageToSend,createAt) {
    let ReceiverUserId:number = this.subscriber['UserId'];
    let SenderUserId:number = Number(localStorage.getItem('userID'));
    let MessageBody:string = messageToSend;
    let ChatGroupId:string = null;
    
    this.chattingService.sendMessage({ReceiverUserId,SenderUserId,MessageBody,ChatGroupId,createAt})
    .subscribe(
      (res)=>{
        //成功处理程序
        //console.log('yes'),
        //console.log('then',createAt.getTime())
      },
      (err) =>{
        //失败处理程序
        this.messagerService.messageSendFailedHandler(createAt.getTime(),this.subscriber['UserId']);
       // console.log('err')
      }
    )
  }



  /*
    called by template event
    get chatting history from service
  */
 getChattingHistory(){
  return this.messagerService.getChattingHistory(this.subscriber['UserId']);
}

  /*
    if no subscriber selected and now click chatting icon
  */
  startNewChatting() {
    this.onStartChatting.emit(false)
  }

  showPhotoIcon(leftOrRight){
    let src = (leftOrRight=='left')? this.photoUrl+this.subscriber['Photo']:this.photoUrl+localStorage.getItem('photo');
    return src;
  }

  /*
    called by template evetn
    message send failed handler
  */
  messageSentFailedHandler(event){
    event.preventDefault()
  }
}
