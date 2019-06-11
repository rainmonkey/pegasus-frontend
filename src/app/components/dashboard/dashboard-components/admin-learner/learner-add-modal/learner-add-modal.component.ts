import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-add-modal',
  templateUrl: './learner-add-modal.component.html',
  styleUrls: ['./learner-add-modal.component.css']
})
export class LearnerAddModalComponent implements OnInit {
  addCourse = true;
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal ) {

  }

  ngOnInit() {
  }

}
