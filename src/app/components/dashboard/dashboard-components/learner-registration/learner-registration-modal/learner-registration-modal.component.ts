import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-learner-registration-modal',
  templateUrl: './learner-registration-modal.component.html',
  styleUrls: ['./learner-registration-modal.component.css']
})
export class LearnerRegistrationModalComponent implements OnInit {

  @Input() whichLearner;
   constructor(public activeModal: NgbActiveModal) {}

   ngOnInit() {
   }
}
