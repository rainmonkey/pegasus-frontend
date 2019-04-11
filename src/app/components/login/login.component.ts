import { Component, OnInit } from '@angular/core';
import {UserDetailService} from '../../user-detail.service';
import {UserDetail} from '../../models/UserDetail';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  detail: any;
  // tslint:disable-next-line:variable-name
  constructor(protected _service: UserDetailService) { }

  ngOnInit() {
    const a = new UserDetail();
    a.password = 'qwe';
    a.username = 'qwe';
    this._service.getUserDetail(a).subscribe(data => {
      // setting;
    });
  }

}
