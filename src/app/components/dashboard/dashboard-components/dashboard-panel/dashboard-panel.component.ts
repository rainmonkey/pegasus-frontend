import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {

  constructor(
    public titleService: Title,
    private router: Router
  ) {
    this.titleService.setTitle('Dashboard | Home');
    this.router.navigate(['/home'])
  }

  ngOnInit() {
  }

}
