import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { AppSettingsService } from 'src/app/settings/app-settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../dashboard-components/support/change-password-modal/change-password-modal.component';
import { environment } from 'src/environments/environment.prod';
import { NotificationPopupComponent } from 'src/app/components/dashboard/general/notifications/notification-popup/notification-popup.component'

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {

  public isPopup = false;
  public hasNoticed: boolean = false;

  photoUrl: any = environment.photoUrl;
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
    private modalService: NgbModal
    ) {
  }

  ngOnInit() {
    this.getUserDetail();
  }


  getUserDetail(){
    this.userDetail['firstName'] = localStorage.getItem('userFirstName');
    this.userDetail['lastName'] = localStorage.getItem('userLastName');
    let photo = localStorage.getItem('photo');
    if (photo)
      this.userDetail.img=this.photoUrl+photo;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    location.reload();
  }
  hideSideBar(){
    this.settingService.sidebarShowStatus.next(!this.settingService.sidebarShowStatus.value)
  }

  changePassword() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent,{size:'lg'})
  }


  /* click bell to toggle popup */
  showPopup() {
    this.isPopup = !this.isPopup;
    console.log('toggel', this.isPopup)
  }
}
