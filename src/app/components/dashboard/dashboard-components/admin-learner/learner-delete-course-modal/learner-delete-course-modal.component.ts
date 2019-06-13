import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import Swal from 'sweetalert2';

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
  constructor(public activeModal: NgbActiveModal, private endCourse : LearnerRegistrationService) {}
  chooseCourse(){
    this.isGroupCourse = !this.isGroupCourse;
  }
  onSubmit(){
    let id = this.whichLearner.LearnerId;
    let fun;
    if(this.isGroupCourse){
      fun = this.endCourse.endGroupCourse(id, this.groupEndDate);
    } else{
      fun = this.endCourse.end121Course(id, this.one2OneEndDate);
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
  }

}
