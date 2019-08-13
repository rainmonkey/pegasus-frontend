import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {
  @Input() isPopup: boolean;

  public tabs: Array<any> = [];
  public tabv: string;

  constructor() { }

  ngOnInit() {
    this.tabv = "Message"
    this.tabs=[
      {
        display: "Messages",
        value: "Message",
        number: 5,
      },
      {
        display: "Backlogs",
        value: "Backlog",
        number: 4,
      }
    ]
  }

  switchTab(value: string) {
    this.tabv = value    
    console.log(value)
  }
  
}
