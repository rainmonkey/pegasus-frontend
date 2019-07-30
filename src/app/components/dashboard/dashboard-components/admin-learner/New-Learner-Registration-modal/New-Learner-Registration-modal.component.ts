import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Command } from 'protractor';

@Component({
  selector: 'app-New-Learner-Registration-modal',
  templateUrl: './New-Learner-Registration-modal.component.html',
  styleUrls: ['./New-Learner-Registration-modal.component.css']
})
export class NewLearnerRegistrationModalComponent implements OnInit {

  @Input() command
  @Input() whichLeaner
  @ViewChild('updateForm') updateFormObj
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  ngOnInit() {

  }

}
