import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  errorMessage: string;
  success = false;
  oldPassword:any
  userName:any
  loginList=[]
  UsererrorMessage:string
  successMessage:string
  newInfo={
    userName:null,
    oldPassword:null,
    newPassword:null,
  }
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public loginService:AuthenticationService) { }

  ngOnInit() {
    this.getUserName()
    this.createForm()
   
  }
  // Winnie This is your component  圆润的走开好吗

  createForm() {
    this.myForm = this.fb.group({
      
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirm: ['', [Validators.required]],
    })
  }

  get f() { return this.myForm.controls; }
  // get old password
  check(){
    this.loginService.changePassword(this.newInfo).subscribe(
      (data) => {console.log(data)},
      (err) => { 
        console.log(err);
        this.UsererrorMessage=err.error.ErrorMessage;
 
      }
        
    )}

   
    getUserName(){
      this.userName=localStorage.getItem('userName' );


    }


  onSubmit() {
    this.submitted = true;
    this.newInfo.userName = this.userName;
    this.newInfo.oldPassword=this.myForm.value.password;
    this.newInfo.newPassword=this.myForm.value.newPassword
    console.log(this.newInfo)
    console.log(this.myForm.value)
    // stop here if form is invalid
    this.check()

    if (this.myForm.invalid) {
      console.log(this.myForm)
      this.errorMessage = 'Please fill all inputs.'
      this.success = false;
      return
    }
    else { 
      
      console.warn('success')
      this.success = true;    
      this.successMessage="Password change successfully"
    }
  }



}