import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/http/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title: string;
  public closeNotification: boolean = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.title = 'Able Music School System';
  }
  handleNotification() {
    this.dashboardService.closePopup(this.closeNotification)
  }

}