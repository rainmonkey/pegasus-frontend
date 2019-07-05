import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-messager-recently',
  templateUrl: './messager-recently.component.html',
  styleUrls: ['./messager-recently.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']
})
export class MessagerRecentlyComponent implements OnInit {
  public recentlySubscribers :Array<object>;
  @Output() onChattingWith = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.recentlySubscribers = sessionStorage.recentlySubscribers;
  }

  /*
  点击选择和谁聊天
  */
  chattingWithHandler() {
    //在sessionStorage里面保存 正在聊天的人
    sessionStorage.setItem('userId', '123');
    this.onChattingWith.emit({ "status": true, "userId": 123 })
  }
}
