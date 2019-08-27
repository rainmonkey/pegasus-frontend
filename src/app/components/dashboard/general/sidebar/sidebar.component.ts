import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserDetail } from '../../../../models/UserDetail';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { AppSettingsService } from 'src/app/settings/app-settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  currentUser: UserDetail;
  users: UserDetail[] = [];
  navitem: any;

  constructor(
    private authenticationService: AuthenticationService,
    private settingService: AppSettingsService

  ) { }

  ngOnInit() {
    // console.log('Sidebar')
    this.settingService.currentSidebarSettings.subscribe(
      (res) => { this.navitem = res; }
    )
  }

  // Method to assign sidebar data
  processData(res) {
    // console.log(res.Data);
    this.navitem = res.Data;
  }
}
