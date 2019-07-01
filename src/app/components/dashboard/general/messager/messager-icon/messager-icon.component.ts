import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = false;
  constructor(private chattingSerice:ChattingService) { }

  ngOnInit() {
    //从后台获取数据
    this.chattingSerice.getChattingList(1)
  }

  popUpMessager(){
    this.popUpModalFlag = true;
  }

  closeMessager(event){
    if(event == 'true'){
      this.popUpModalFlag = false;
    }
  }

}
