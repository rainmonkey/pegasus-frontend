import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-detail-modal',
  templateUrl: './learner-detail-modal.component.html',
  styleUrls: ['./learner-detail-modal.component.css']
})
export class LearnerDetailModalComponent implements OnInit {
  @Input() command;
  @Input() whichLearner;
  public isGroupCourse: boolean = true;
  public isCustomCourse: boolean = false;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.whichLearner)
  }
  chooseGroupCourse() {
    this.isGroupCourse = true;
    this.isCustomCourse = false;
  }
  chooseCustomCourse() {
    this.isCustomCourse = true;
    this.isGroupCourse = false;
  }
}
