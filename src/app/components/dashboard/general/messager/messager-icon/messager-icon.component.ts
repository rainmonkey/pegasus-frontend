import { Component, OnInit } from '@angular/core';
import { ChattingService } from 'src/app/services/repositories/chatting.service';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = true;
  constructor(private chattingService:ChattingService) { }

  ngOnInit() {
    //从后台获取数据
    // this.chattingService.getChatListFronServer().subscribe(
    //   (res) =>{

    //   }
    // )
  }

  /*
    display messager chatting component
      --> when user click messager icon, display component 
  */
  displayMessager(){
    this.popUpModalFlag = true;
  }

  /*
    hide messager chatting component
      --> when user click close sign, hide component 
  */
  hideMessager(event){
    if(event == 'true'){
      this.popUpModalFlag = false;
    }
  }

}
