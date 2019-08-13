import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { group } from '@angular/animations';
import { anyKeysRemoved } from '@fullcalendar/core/util/object-similarity';

@Component({
  selector: 'app-parent-Registration-Form',
  templateUrl: './parent-Registration-Form.component.html',
  styleUrls: ['./parent-Registration-Form.component.css']
})
export class ParentRegistrationFormComponent implements OnInit {
  public parentRegForm: FormGroup
  parent = []
  get parentForm() { return this.parentRegForm.get('parentForm') as FormArray; }
  @Input() command
  @Input() whichLearner
  @Input() newLearner
  constructor(private fb: FormBuilder, ) { }

  ngOnInit() {
    this.parentRegForm = this.fb.group({
      parentForm: this.fb.array([this.test()])
    });
    // this.setParentForm();
  }


  // setParentForm(){
  //   this.parentForm.push(
  //     this.fb.group({
  //       FirstName: ['', Validators.required],
  //       LastName: ['', Validators.required],
  //       Relationship: ['', Validators.required],
  //       ContactNum: ['', Validators.required],
  //       Email: ['', [Validators.required, Validators.email]]
  //     })
  //   )
  // }

  test() {
    let tempObj: any
    tempObj=this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Relationship: ['', Validators.required],
      ContactNum: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]]
    })
    return tempObj
  }




  resetParent() {
    this.parentForm.reset();
  }
  deleteParent(i) {
    this.parentForm.removeAt(i);
  }
  addParent() {
    this.parentForm.push(
      this.fb.group({
        FirstName: ['', Validators.required],
        LastName: ['', Validators.required],
        Relationship: ['', Validators.required],
        ContactNum: ['', Validators.required],
        Email: ['', Validators.required, Validators.email],
      })
    );
    // console.log('addParent', this.parentForm.value)
  }
}
