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

  currentUser: UserDetail;

  constructor( 
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

}
