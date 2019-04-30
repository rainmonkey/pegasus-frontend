import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { UserDetail } from '../../../_models';
import { UserDetailService, AuthenticationService } from '../../../_services';

@Component({
  selector: 'app-navibar',
  templateUrl: './navibar.component.html',
  styleUrls: ['./navibar.component.css']
})
export class NavibarComponent implements OnInit, OnDestroy {
  currentUser: UserDetail;
  currentUserSubscription: Subscription;
  users: UserDetail[] = [];

  public navitem: any[] = [
    {
      pagename : 'Home'
    },
    {
      pagename : 'Tables'
    },
    {
      pagename : 'Charts'
    },
    {
      pagename : 'Forms'
    }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserDetailService
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.users = users;
    });
  }
}
