import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-New-Learner-Registration-modal',
  templateUrl: './New-Learner-Registration-modal.component.html',
  styleUrls: ['./New-Learner-Registration-modal.component.css']
})
export class NewLearnerRegistrationModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

}
