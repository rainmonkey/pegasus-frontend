import { Component, OnInit } from '@angular/core';
import wdtEmojiBundle from 'wdt-emoji-bundle'

@Component({
  
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.css']
})

export class ChattingComponent implements OnInit {
  //数组里的顺序和名字要和HTML里的一致
  public functionalBtns: Array<string> = ['Subscribers', 'recently', 'chatting'];
  public currentPageIndex: number = 0;
  constructor() {}

  ngOnInit() {
    wdtEmojiBundle.defaults.emojiSheets = {
      'apple'    : './sheets/sheet_apple_64_indexed_128.png',
      'google'   : './sheets/sheet_google_64_indexed_128.png',
      'twitter'  : './sheets/sheet_twitter_64_indexed_128.png',
      'emojione' : './sheets/sheet_emojione_64_indexed_128.png',
      'facebook' : './sheets/sheet_facebook_64_indexed_128.png',
      'messenger': './sheets/sheet_messenger_64_indexed_128.png'
  };
  wdtEmojiBundle.defaults.emojiType = 'apple';
  wdtEmojiBundle.init('.a');
  }

  selectFunctionalBtn(selectId) {
    //如果点击的是当前页的btn 则不发生任何事情
    if (selectId == this.currentPageIndex) {
      return;
    }
    else {
      this.currentPageIndex = selectId;
      for (let i in this.functionalBtns) {
        if (selectId == i) {
          let selectObj = document.getElementById(this.functionalBtns[i]);
          selectObj.style.display = 'block';
        }
        else {
          let otherObj = document.getElementById(this.functionalBtns[i]);
          otherObj.style.display = 'none';
        }
      }
    }
  }
}
