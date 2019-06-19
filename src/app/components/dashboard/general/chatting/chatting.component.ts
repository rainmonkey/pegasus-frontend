import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.css']
})
export class ChattingComponent implements OnInit {
  //数组里的顺序和名字要和HTML里的一致
  public functionalBtns:Array<string> = ['Subscribers','recently','chatting'];
  public currentPageIndex:number = 0;
  constructor() { }

  ngOnInit() {
    let emoji = document.getElementById('emojiArea');
  
  }

  selectFunctionalBtn(selectId){
    //如果点击的是当前页的btn 则不发生任何事情
    if(selectId == this.currentPageIndex){
      return;
    }
    else{
      this.currentPageIndex = selectId;
      for(let i in this.functionalBtns){
        if(selectId == i){
          let selectObj = document.getElementById(this.functionalBtns[i]);
          selectObj.style.display = 'block';
        }
        else{
          let otherObj = document.getElementById(this.functionalBtns[i]);
          otherObj.style.display = 'none';
        }
      }
    }
  }
}
