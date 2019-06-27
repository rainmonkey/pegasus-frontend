import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
//import * as Emoji from 'node-emoji/'

@Component({
  selector: 'app-messager-chatting',
  templateUrl: './messager-chatting.component.html',
  styleUrls: ['./messager-chatting.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']
})
export class MessagerChattingComponent implements OnInit {
  public chattingDisplayFlag: boolean = false;
  @Input() userId;
  @Output() onStartChatting = new EventEmitter();

  constructor() { }
  ngOnInit() {
    console.log('a')
  }

  ngOnChanges() {
    //console.log(this.userId);
    if (this.userId !== null) {
      this.chattingDisplayFlag = true;
    }
  }
  /*
    显示emoji选择框
  */
  showEmojiPicker() {
    let emojiPickerObj = document.getElementById('m_c_emoji_picker_panel');
    console.log(emojiPickerObj.style.display)
    if (emojiPickerObj.style.display == 'none' || emojiPickerObj.style.display == '') {
      emojiPickerObj.style.display = 'block';
    }
    else {
      emojiPickerObj.style.display = 'none';
    }
    
  }

  /*
    when user click emoji, add it to input area's relavent location
  */
  clickEmoji(event) {
    //获取所选择的emoji表情
    // let emoji = Emoji.get(event.emoji.colons);
    // //获取emoji所占的字符数
    // let emojiLength = emoji.length;
    // //获取textarea对象
    // let obj = document.getElementById('m_c_text_area');
    // //获取光标位置
    // let cursorStartIndex = obj['selectionStart'];
    // //向指定光标位置添加表情
    // obj['value'] = this.insertStr(obj['value'], cursorStartIndex, emoji);
    // //获取新的光标位置
    // this.setCursorPosition(obj, cursorStartIndex + emojiLength);
    console.log('a')

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
    在指定位置插入字符
  */
  insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start)
  }

  clickMessageSendBtn(event) {
    console.log(event)
  }

  startChatting(){
    this.onStartChatting.emit(true)
  }

}
