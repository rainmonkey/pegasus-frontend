import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from "src/app/services/http/dashboard.service";

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {
  @Input() isPopup: boolean;


  public messages: any[];
  public msgNumber: number;
  // public loadingFlag: boolean = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // this.loadingFlag = true;
    this.getMessage()
  }

  getMessage() {
    this.dashboardService.getMessage().subscribe(
      res => {
        console.log('message', res)
        this.messages = res['data'];
        // this.msgNumber = res['data'].length;
        // this.loadingFlag = false;
      },
      err => {
        console.log("err", err);
      }
    )
  }
}
