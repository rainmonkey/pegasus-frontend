import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';

@Component({
  selector: 'app-learner-edit-modal',
  templateUrl: './learner-edit-modal.component.html',
  styleUrls: ['./learner-edit-modal.component.css']
})
export class LearnerEditModalComponent implements OnInit {
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal, private LearnerListService: LearnersService, ) {

  }

  ngOnInit() {
    
  }
}



