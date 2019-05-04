import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserDetail } from '../../../../models/UserDetail';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { UsersService } from 'src/app/services/http/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: UserDetail;
  users: UserDetail[] = [];

  public navitem: any[] = [
    {
      pagename : 'Home',
      pageicon : 'fa-home',
      pagelink : 'testcontent'
    },
    {
      pagename : 'Teachers',
      pageicon : 'fa-chalkboard-teacher',
      pagelink : 'teacher'
    },
    {
      pagename : 'Registration',
      pageicon : 'fa-th',
      pagelink : 'learnerRegistration'
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
    private userService: UsersService
  ) {
  }

  ngOnInit() {
    // Get data
    // this.userService.getSidebar()
  }

  // Method to assign sidebar data

  


}
