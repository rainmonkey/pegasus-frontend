import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Title } from '@angular/platform-browser';
import { MessagesLibrary } from 'src/app/shared/libraries/messages-library';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { GeneralRepoService } from '../../../services/repositories/general-repo.service';

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
  pathArray;

  constructor(
    public titleService: Title,
    public http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messageService: MessagesLibrary,
    private modalService: NgbModal,
    private generalRepoService: GeneralRepoService,
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
    console.log(this.returnUrl)


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
      (data) => {
        // this.getPath();
        this.initAuthPath();
      },
      (err) => {
        this.loading = false,
        this.errorMessage = this.messageService.apiErrorMessageProcessing(err)
      }
    );
  }
  initAuthPath(){
    this.generalRepoService.pathAllowed();
    this.generalRepoService.pathArraySubject
    .subscribe(
      res=>{
      if(res !==[]){this.onLoginSuccess();}
      },
      error=>{
      }
    )
  }

  onLoginSuccess() : void{
    this.router.navigate([this.returnUrl]);
  }

  forgotPassword(){
    const modalRef = this.modalService.open(ForgotPasswordModalComponent,{size:'lg'})
  }
  // GET ROLE ID AND PATH
  // getPath(){
  //   let userState = localStorage.getItem('Role');
  //   this.generalRepoService.getPathById(userState).subscribe(
  //   res=>{
  //      let pathAllowedTemp = res.Data;
  //      let pathArray = pathAllowedTemp.map(ele=>ele.Url);
  //      this.generalRepoService.pathArraySubject.next(pathArray);
  //     })
  // }
}
