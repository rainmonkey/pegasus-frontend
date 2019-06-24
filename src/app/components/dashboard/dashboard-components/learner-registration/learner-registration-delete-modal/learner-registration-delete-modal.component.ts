import { Component, OnInit, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-registration-delete-modal',
  templateUrl: './learner-registration-delete-modal.component.html',
  styleUrls: ['./learner-registration-delete-modal.component.css']
})
export class LearnerRegistrationDeleteModalComponent implements OnInit {
  isGroupCourse = false;
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal) {}
  chooseGroupCourse(){
    this.isGroupCourse = !this.isGroupCourse;
  }
  ngOnInit() {
  }

}
