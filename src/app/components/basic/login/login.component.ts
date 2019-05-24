import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Title } from '@angular/platform-browser';
import { MessagesService } from 'src/app/services/others/messages.service';

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
    private authenticationService: AuthenticationService,
    private messageService: MessagesService,
  ) {
    
  }

  ngOnInit() {
  	this.titleService.setTitle('Login');

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/home';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid || !this.loginForm.dirty) {
        return this.errorMessage = this.messageService.formNoEmailPassword;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe(
      (data) => {this.onLoginSuccess()},
      (err) => {
        this.loading = false,
        this.errorMessage = this.messageService.apiErrorMessageProcessing(err)
      }
    );
  }

  onLoginSuccess() : void{
    this.router.navigate([this.returnUrl]);
  }

}