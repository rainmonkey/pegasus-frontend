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
  navitem: any;

  public userDetail =
    {
      firstname : 'Chris',
      lastname : 'He',
      position : 'President of US',
      img : '../../../../assets/images/usersimg/testimg.jpg'
    }
  
    public dropdown: any[] = [
      {
        dropname: 'invoice',
        dropicon: 'fa-file-invoice-dollar',
        droplink: 'invoice'
      },
      {
        dropname: 'products',
        dropicon: 'fa-shopping-cart',
        droplink: 'products'
      },
      {
        dropname: 'registration',
        dropicon: 'fa-registered',
        droplink: 'registration'
      },
      {
        dropname: 'other',
        dropicon: 'fa-window-restore',
        droplink: 'other'
      }
    ]

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    // Get data
    this.userService.getSidebar().subscribe(
      (res)=>this.processData(res),
      (err)=>{console.warn(err)}
    )
  }

  // Method to assign sidebar data
  processData(res){
    console.log(res.Data);
    this.navitem = res.Data;
  }



}
