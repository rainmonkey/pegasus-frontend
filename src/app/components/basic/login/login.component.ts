import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMessage: string;

  constructor(
    public titleService: Title,
    public http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    
  }

  ngOnInit() {
  	this.titleService.setTitle('Login');

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid || !this.loginForm.dirty) {
        return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe(
      (data) => {
        this.router.navigate([this.returnUrl]);
      },
      (err) => {
        this.loading = false,
        this.processError(err);
      }
    );
  }

  processError(err) {
    console.warn(err)
    if (err.error) {
      if(err.error.ErrorMessage){
        this.errorMessage = err.error.ErrorMessage;
      } else {
        this.errorMessage = 'Sorry, something went wrong';
      }
    } else {
      this.errorMessage = 'Sorry, something went wrong';
    }
  }
}