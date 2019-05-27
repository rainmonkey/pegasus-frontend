import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
const newLocal = Validators.required;
@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {
myForm: FormGroup;
  constructor(public fb:  FormBuilder) { }

  ngOnInit() {
    this.createForm()
  }
  // Winnie This is your component  圆润的走开好吗

  createForm(){
    this.myForm = this.fb.group({
      userName:['',[Validators.required]],
      oldPassword:['',[Validators.required]],
      newPassword:['',[Validators.required]],
      confirm:['',[Validators.required]],
    })
  }
}

