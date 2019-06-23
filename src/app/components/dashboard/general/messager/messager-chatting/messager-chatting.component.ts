import { Component, OnInit } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-messager-chatting',
  templateUrl: './messager-chatting.component.html',
  styleUrls: ['./messager-chatting.component.css',
              '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']})
export class MessagerChattingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showEmojiPicker(){
    let emojiPickerObj = document.getElementById('m_c_emoji_picker_panel');
    console.log(emojiPickerObj.style.display)
    if(emojiPickerObj.style.display == 'none' || emojiPickerObj.style.display == ''){
      emojiPickerObj.style.display = 'block';
    }
    else{
      emojiPickerObj.style.display = 'none';
    }
  }

  /*
    when user click emoji, add it to input area
  */
  clickEmoji(event){
    console.log(event)
    let obj = document.getElementById('m_c_text_area');
    obj['value'] +='<span>ssss</span>'
    console.log(obj['value'])
  }

}
