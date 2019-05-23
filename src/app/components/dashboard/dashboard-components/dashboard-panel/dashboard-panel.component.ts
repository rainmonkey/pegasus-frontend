import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent  {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    if(!this.activatedRoute.snapshot.firstChild){
      this.router.navigate(['/home'])
    }
  }

}
