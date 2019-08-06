import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-New-Learner-Registration-modal',
  templateUrl: './New-Learner-Registration-modal.component.html',
  styleUrls: ['./New-Learner-Registration-modal.component.css']
})
export class NewLearnerRegistrationModalComponent implements OnInit {
  public infoMessage: string = '';
  public messageColor: string;
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;

  @Input() command
  @Input() whichLeaner;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  @ViewChild('updateForm') updateFormObj
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  ngOnInit() {

  }

  onSubmit(){

  }

  onClose() {
    if (this.updateFormObj.registrationForm.dirty == true ) {
      this.refreshFlag.emit(true);
    }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }
}
