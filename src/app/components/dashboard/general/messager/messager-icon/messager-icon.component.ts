import { Component, OnInit } from '@angular/core';
import { ChattingService } from 'src/app/services/repositories/chatting.service';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = false;
  public initiateFlag = false;

  constructor(private chattingSerice:ChattingService) { }

  ngOnInit() {
    //sent get subscribers request
    this.chattingSerice.getSubscribersList(1);

    
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
