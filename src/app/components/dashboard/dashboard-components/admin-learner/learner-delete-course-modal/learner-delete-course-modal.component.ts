import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-delete-course-modal',
  templateUrl: './learner-delete-course-modal.component.html',
  styleUrls: ['./learner-delete-course-modal.component.css']
})
export class LearnerDeleteCourseModalComponent implements OnInit {
  isGroupCourse = false;
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal) {}
  chooseCourse(){
    this.isGroupCourse = !this.isGroupCourse;
  }

  ngOnInit() {
  }

}
