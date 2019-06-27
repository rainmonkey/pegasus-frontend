import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-messager-subscribers',
  templateUrl: './messager-subscribers.component.html',
  styleUrls: ['./messager-subscribers.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']
})
export class MessagerSubscribersComponent implements OnInit {
  public groupChatSwitchFlag: boolean = true;
  @Output() onChattingWith = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  /*
    switch between subscribers and group chat
  */
  changeChattingGroup(event,commandId) {
    if(commandId == 0){
      this.groupChatSwitchFlag = true;
    }
    else if(commandId == 1){
      this.groupChatSwitchFlag = false;
    }
  }

  /*
    When user click group label, show subscribers in this group
  */
  displayGroup(event,whichGroup){
    let groupObj = document.getElementById(whichGroup);
    if(groupObj.style.display == '' || groupObj.style.display == 'none'){
      groupObj.style.display = 'block';
    }
    else{
      groupObj.style.display = 'none';
    }
  }

  chattingWithHandler(event){
    event.preventDefault();
    this.onChattingWith.emit({"status":true,"userId":123})
    console.log('aaa')
  }

}
