import { Component, OnInit, Input } from '@angular/core';
import { Command } from 'protractor';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-New-Registration-Form',
  templateUrl: './New-Registration-Form.component.html',
  styleUrls: ['./New-Registration-Form.component.css']
})
export class NewRegistrationFormComponent implements OnInit {
  public registrationForm: FormGroup

  @Input() command
  @Input() whichLearner
  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.registrationForm = this.fb.group(this.formBuild());
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
      groupObj={
        FirstName:[{value:this.whichLearner.FirstName}, Validators.required],
        MiddleName:[{value:this.whichLearner.MiddleName}],
        LastName: [{value:this.whichLearner.LastName}, Validators.required],
        Gender: [{value:this.whichLearner.Gender}, Validators.required],
        dob: [{value:this.whichLearner.Dob}, Validators.required],
        EnrollDate: [{value:this.whichLearner.EnrollDate}, Validators.required],
        ContactNum:[{value:this.whichLearner.ContactNum}, Validators.required],
        Email:[{value:this.whichLearner.Email}, [Validators.required,Validators.email]],
        Address:[{value:this.whichLearner.Address}],
        OrgId:[{value:this.whichLearner.OrgId}, Validators.required],
        LearnerLevel:[{value:this.whichLearner.LearnerLevel}, Validators.required],
        LevelType:[{value:this.whichLearner.LevelType}, Validators.required],
        IsUnder18:[{value:this.whichLearner.IsUnder18}, Validators.required],
        PaymentPeriod:[{value:this.whichLearner.PaymentPeriod}, Validators.required],
        Referrer:[{value:this.whichLearner.Referrer}],
        Comment:[{value:this.whichLearner.Comment}],

        // photo
        photo:[null],
        grade:[null],
        Agreement:[null],
        OtherFile:[null],
      }
    }
    return groupObj
  }


}
