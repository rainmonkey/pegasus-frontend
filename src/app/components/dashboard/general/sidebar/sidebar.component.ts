import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { UserDetail } from '../../../../models/UserDetail';
import { AuthenticationService } from '../../../../services/Auth/authentication.service';
import { UserDetailService } from '../../../../services/user-detail.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: UserDetail;
  currentUserSubscription: Subscription;
  users: UserDetail[] = [];

  public navitem: any[] = [
    {
      pagename : 'Home',
      pageicon : 'fa-home',
      pagelink : 'testcontent'
    },
    {
      pagename : 'Registration',
      pageicon : 'fa-th',
      pagelink : 'registration'
    },
    {
      pagename : 'Payment',
      pageicon : 'fa-chart-bar',
      pagelink : 'payment'
    },
    {
      pagename : 'Forms',
      pageicon : 'fa-clipboard',
      pagelink : ''
    }
  ];

  public userDetail =
    {
      firstname : 'Chris',
      lastname : 'He',
      position : 'President of US',
      img : '../../../../assets/images/usersimg/testimg.jpg'
    }  


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserDetailService
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.loadAllUsers();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  // private loadAllUsers() {
  //   this.userService.getAll().pipe(first()).subscribe(users => {
  //       this.users = users;
  //   });
  // }
}
