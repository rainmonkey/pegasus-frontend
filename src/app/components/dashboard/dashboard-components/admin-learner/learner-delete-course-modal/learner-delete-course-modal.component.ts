import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-learner-delete-course-modal',
  templateUrl: './learner-delete-course-modal.component.html',
  styleUrls: ['./learner-delete-course-modal.component.css']
})
export class LearnerDeleteCourseModalComponent implements OnInit {
  isGroupCourse = false;
  @Input() whichLearner;
  groupEndDate;
  one2OneEndDate;
  groupEndArray = [];
  ono2OneEndArray = [];
  dateForm;

  constructor(public activeModal: NgbActiveModal, private endCourse: LearnerRegistrationService, private fb: FormBuilder) {
    this.dateForm = this.fb.group({
    groupDateForm: this.fb.array([]),
    ono2OneDateForm: this.fb.array([])
  });
  }



  get groupArray(): FormArray { return this.dateForm.get('groupDateForm');}
  get ono2OneArray(): FormArray { return this.dateForm.get('ono2OneDateForm');}

  // createForm(){
  //   this.dateForm = this.fb.group({
  //     groupDateForm: this.fb.array([]),
  //     ono2OneDateForm: this.fb.array([])
  //   });
  // }

  chooseCourse() {
    this.isGroupCourse = !this.isGroupCourse;
  }

  getCourse() {
    this.whichLearner.LearnerGroupCourse.forEach(ele => {
      this.groupArray.push(
        this.fb.group({
          GroupEnd: '',
        })
      );
    });
    this.whichLearner.One2oneCourseInstance.forEach(ele => {
      this.ono2OneArray.push(
        this.fb.group({
          OneEnd: '',
        })
      );
    });
  }

  changeGroupDate(event,i){
    console.log(this.groupArray.controls[i], i, event);
    this.groupArray.controls[i].patchValue({
      GroupEnd: event.target.value,
    });
    console.log(this.groupArray);
  }

  onSubmit(ele,i){
    console.log('!@#$%^&*',this.ono2OneArray)
    let fun;
    if(this.isGroupCourse){
      let idIns = ele.GroupCourseInstanceId;
      fun = this.endCourse.endGroupCourse(idIns, this.groupArray.controls[i].value);
    } else{
      let idIns = ele.CourseInstanceId
      fun = this.endCourse.end121Course(idIns, this.ono2OneArray.controls[i].value);
    }
    fun.subscribe(
      res => {
        Swal.fire({
          title: 'Success!',
          text: 'Your Work Has Been Save',
          type: 'success',
        });
      },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Sorry! '+ error.error.ErrorMessage,
          type: 'error',
        });
      });
  }
  ngOnInit() {
    // this.createForm();
    this.getCourse();
    console.log(this.dateForm)
  }

}
