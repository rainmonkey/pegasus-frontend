import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { UserDetail } from '../../models/UserDetail';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  detail: any;
  LoginForm: FormGroup;
  // tslint:disable-next-line:variable-name
  constructor(protected _service: UserDetailService, private fb: FormBuilder, public http: HttpClient) {

  }

  ngOnInit() {
    this.LoginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  SubmitLoginForm() {
    const userLoginDetail = new UserDetail();
    userLoginDetail.username = this.LoginForm.get('username').value;
    userLoginDetail.password = this.LoginForm.get('password').value;
    this._service.getUserDetail(userLoginDetail).subscribe(
      data => {
        if (data.errorMessage === 'Username does not exist.') {
          alert(data.errorMessage); // 自己调
        } else if (data.errorMessage === 'The password is incorrect') {
          alert(data.errorMessage); // 自己调
        } else {
      //  自己写 data.data是数据
        }
      }
    );
  }


}

