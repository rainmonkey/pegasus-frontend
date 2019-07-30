import { Component, OnInit, Input } from '@angular/core';
import { Command } from 'protractor';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-New-Registration-Form',
  templateUrl: './New-Registration-Form.component.html',
  styleUrls: ['./New-Registration-Form.component.css']
})
export class NewRegistrationFormComponent implements OnInit {
  @Input() command
  @Input() whichLearner
  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.formBuild()
  }

  formBuild(){
    let groupObj: any;
    if(this.command == 1 ){
      groupObj={
        FirstName:[null, Validators.required],
        MiddleName:[null],
        LastName: [null, Validators.required],
        Gender: [null, Validators.required],
        dob: [null, Validators.required],
        EnrollDate: [null, Validators.required],
        ContactNum:[null, Validators.required],
        Email:[null, [Validators.required,Validators.email]],
        Address:[null],
        OrgId:[null, Validators.required],
        LearnerLevel:[null, Validators.required],
        LevelType:[null, Validators.required],
        IsUnder18:[null, Validators.required],
        PaymentPeriod:[null, Validators.required],
        Referrer:[null],
        Comment:[null],

        // photo
        photo:[null],
        grade:[null],
        Agreement:[null],
        OtherFile:[null],
      }
    }
    else if(this.command==2){

    }
  }


}
