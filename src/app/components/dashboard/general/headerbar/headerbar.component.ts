import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { UserDetail } from '../../../../models/UserDetail';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {
  
  userDetail =
    {
      img : '../../../../assets/images/usersimg/testimg.jpg',
      firstName:'',
      lastName:''
    }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
  }

  ngOnInit() {
    this.getUserDetail()
  }

  getUserDetail(){
    this.userDetail['firstName'] = localStorage.getItem('userFirstName')
    this.userDetail['lastName'] = localStorage.getItem('userLastName')
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
