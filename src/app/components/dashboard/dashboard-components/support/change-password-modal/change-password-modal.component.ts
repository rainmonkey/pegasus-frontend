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
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public loginService:AuthenticationService) { }

  ngOnInit() {
    this.createForm()
  }
  // Winnie This is your component  圆润的走开好吗

  createForm() {
    this.myForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirm: ['', [Validators.required]],
    })
  }

  // get old password
  getOldPassword(){
   
  }


  // check old password
  oldPasswordconfirm(){

  }

  onSubmit() {
    this.submitted = true;
    console.log(this.myForm.value)
    // stop here if form is invalid


    if (this.myForm.invalid) {
      console.log(this.myForm)
      this.errorMessage = 'Please fill all inputs.'
      this.success = false;
      return
    }
    else {
      console.warn('success')
      this.success = true;

    }
  }

}

