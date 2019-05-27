import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  errorMessage: string;
  success = false;
  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm()
  }
  createForm() {
    this.myForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: [null, [Validators.required, Validators.email]]
    })
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
