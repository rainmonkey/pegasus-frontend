import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { UserDetail } from '../../../../models/UserDetail';
import { AppSettingsService } from 'src/app/settings/app-settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../dashboard-components/support/change-password-modal/change-password-modal.component'

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
    private authenticationService: AuthenticationService,
    public settingService: AppSettingsService,
    private modalService: NgbModal,
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
  hideSideBar(){
    console.log('asd')
    this.settingService.sidebarShowStatus.next(!this.settingService.sidebarShowStatus.value)
  }

  forgotPassword() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent,{size:'lg'})
  }
}
