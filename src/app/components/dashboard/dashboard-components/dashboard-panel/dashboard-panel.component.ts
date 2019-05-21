import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {

  constructor(
    public titleService: Title,

  ) {
    this.titleService.setTitle('Dashboard | Home');
  }

  ngOnInit() {
  }

}
