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

  formBuild() {
    let groupObj: any;
    if (this.command == 1) {
      groupObj = {
        FirstName: [null, Validators.required],
        MiddleName: [null],
        LastName: [null, Validators.required],
        Gender: [null, Validators.required],
        dob: [null],
        EnrollDate: [null],
        ContactNum: [null],
        Email: [null, [Validators.required, Validators.email]],
        Address: [null],
        OrgId: [null, Validators.required],
        LearnerLevel: [null, Validators.required],
        LevelType: [null],
        IsUnder18: [null],
        PaymentPeriod: [null],
        Referrer: [null],
        Comment: [null],

        // photo
        photo: [null],
        grade: [null],
        Agreement: [null],
        OtherFile: [null],
      }
    }
    else {
      console.log(this.whichLearner.FirstName)
      console.log(typeof(this.whichLearner.FirstName))
      groupObj = {
        FirstName: [this.whichLearner.FirstName , Validators.required],
        MiddleName: [ this.whichLearner.MiddleName ? this.whichLearner.MiddleName : ' ' ],
        LastName: [this.whichLearner.LastName, Validators.required],
        Gender: [ this.whichLearner.Gender, Validators.required],
        dob: [this.whichLearner.Dob ],
        EnrollDate: [ this.whichLearner.EnrollDate ],
        ContactNum: [this.whichLearner.ContactNum ],
        Email: [this.whichLearner.Email,[Validators.required, Validators.email]],
        Address: [this.whichLearner.Address ],
        OrgId: [this.whichLearner.OrgId , Validators.required],
        LearnerLevel: [ this.whichLearner.LearnerLevel , Validators.required],
        LevelType: [this.whichLearner.LevelType ],
        IsUnder18: [ this.whichLearner.IsUnder18 ],
        PaymentPeriod: [this.whichLearner.PaymentPeriod ],
        Referrer: [this.whichLearner.Referrer],
        Comment: [this.whichLearner.Comment ],

        // photo
        photo: [null],
        grade: [null],
        Agreement: [null],
        OtherFile: [null],
      }
    }
    return groupObj
  }


}
