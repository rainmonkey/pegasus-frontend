import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettingsService } from 'src/app/settings/app-settings.service';


@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent  {
  sidebarHide=true
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public settingService: AppSettingsService
  ) {
    if(!this.activatedRoute.snapshot.firstChild){
      this.router.navigate(['/home'])
    }
    // this.sidebarHide=false
    this.settingService.sidebarShowStatus.subscribe(
      (res)=>{this.sidebarHide = res}
    )
  }

}