import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-learner-registration-confirm-modal',
  templateUrl: './learner-registration-confirm-modal.component.html',
  styleUrls: ['./learner-registration-confirm-modal.component.css']
})
export class LearnerRegistrationConfirmModalComponent implements OnInit {
  fdObj = {};
  command: number;
  learnerId: number;
  groupCourse = [];
  oneOnOneCourse = [];
  isGroupCourse = false;
  addCourse = false;
  errorMsg;

  // loading icon
  isloading = false;
  isConfirmClick = false;
  @Output() clickConfirm: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private registrationService: LearnerRegistrationService,
    private router: Router
    ) { }

  ngOnInit() {
  }
  onSubmit(){
    // return console.log(this.fdObj)
    this.isConfirmClick = true;
    console.log(this.groupCourse)
    this.isloading = true;
    console.log(this.command, this.learnerId, this.isloading);
    let fun;
    if (this.command === 1) {
      // regist new student information may add group course or 121 course in one object
      fun= this.registrationService.postStudent(this.fdObj);
      
    }else if (this.command === 2) {
      // delete course
      fun= this.registrationService.putStudent(this.learnerId, this.fdObj);
    }else if (this.command === 3) {
      // add oneOnOne or group course for exist learner
      // can only add group course or only add 121 course
      if(this.isGroupCourse){
      let temp = {LearnerGroupCourses: this.groupCourse};
      fun= this.registrationService.addGroupCourse(temp);
    }
      else{
        let temp = {OnetoOneCourses: this.oneOnOneCourse};
        fun = this.registrationService.add121Course(temp);
      }
    }

    fun.subscribe(
      data => {
        this.isloading = false;
        this.isConfirmClick = false;
        this.isGroupCourse = false;
        console.log('Success!', data);
        this.activeModal.dismiss();
        // emit submit information to parents components;
        let submitted: boolean = true;
        this.clickConfirm.emit(submitted);
        // show alert;
        // addCourse for group or onetoone
        if (this.addCourse || this.learnerId) {
          Swal.fire({
            title: 'Your Work Has Been Saved',
            type: 'success',
            showConfirmButton: false,
          });
        } else {
          this.router.navigate(['/learner/success']); }
        this.addCourse = false;
      },
      error => {
        console.log(error)
        this.isloading = false;
        this.isConfirmClick = false;
        this.isGroupCourse = false;
        this.addCourse = false;
        this.errorMsg = error;
        this.activeModal.dismiss();
        Swal.fire({
          title: 'Sorry! ' + error.error.ErrorMessage,
          type: 'error',
          showConfirmButton: false,
        });
        console.log('Error!', error);
      }
    )

  }

}
