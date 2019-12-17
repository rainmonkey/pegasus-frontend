import { SessionsService } from 'src/app/services/http/sessions.service';
import { SessionsCalendarViewAdminComponent } from './../sessions-views/sessions-calendar-view-admin/sessions-calendar-view-admin.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sessions-topviews',
  templateUrl: './sessions-topviews.component.html',
  styleUrls: ['./sessions-topviews.component.css']
})
export class SessionsTopviewsComponent implements OnInit {
 orgs:any;
 selectedOrg:number;

  constructor(private sessionsService: SessionsService) { }

  ngOnInit() {
    this.sessionsService.getOrgs().subscribe(
      res=>{
        this.orgs=res['Data'];
      }
    )
  }

}
