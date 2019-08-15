import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationService } from 'src/app/services/http/learner-registration.service';
import { RegistrationToParentComponent } from '../registration-To-parent/registration-To-parent.component';

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
  submit=false;
  @Input() command
  @Input() whichLearner;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  @ViewChild('updateForm') updateFormObj


  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private learnerRegServer: LearnerRegistrationService) { }

  ngOnInit() {

  }

  onSubmit() {
    console.log(this.updateFormObj.registrationForm)
    if (this.updateFormObj.registrationForm.value) {
      this.submitionFlag = false;
      this.infoMessage = 'loading.....'
      this.loadingGifFlag = true;
      let valueToSubmit = this.updateFormObj.registrationForm.value;
      let vailadValue = this.checkInputVailad(valueToSubmit);
      if (vailadValue !== null) {
        // this.sortLearnerOthers()
        this.stringifySubmitStr(vailadValue)

      }
    }
  }

  checkInputVailad(valueToSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.updateFormObj.registrationForm.controls) {
      this.updateFormObj.registrationForm.controls[i].touched = true;
    }
    //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
    if (this.updateFormObj.registrationForm.status == 'VALID') {
      return this.prepareSubmitData(valueToSubmit);
    }
    else {
      this.infoMessage = 'Please check your input.'
      this.loadingGifFlag = false;
      this.messageColor = '#dc3545';
      this.submitionFlag = true;
      return null;
    }
  }

  prepareSubmitData(valueToSubmit) {
    valueToSubmit.PaymentPeriod = Number(valueToSubmit.PaymentPeriod)
    valueToSubmit.LearnerOthers = this.updateFormObj.confirmLearner()
    // valueToSubmit.IsUnder18 = this.updateFormObj.IsUnder18

    return valueToSubmit
  }

  stringifySubmitStr(vailadValue) {
    let submit = new FormData();
    submit.append('details', JSON.stringify(vailadValue));
    submit.append('Photo', this.updateFormObj.selectedPhoto);
    submit.append('G5Certification', this.updateFormObj.selectedGrade);
    submit.append('FormUrl', this.updateFormObj.selectedAgreement);
    submit.append('OtherfileUrl', this.updateFormObj.selectedOther);

    this.submitByMode(submit)
  }

  submitByMode(submit) {
    if (this.command == 1) {
      let obj = this.learnerRegServer.postStudent(submit)
      this.subscribeHandler(obj);
    }
    else if (this.command == 2) {
      let obj = this.learnerRegServer.putStudent(this.whichLearner.LearnerId, submit)
      this.subscribeHandler(obj);
    }
  }

  subscribeHandler(obj) {
    obj.subscribe(
      (res) => {
        this.showInfoMessage('Submit success!', '#28a745', false)
        this.submitionFlag = false;
        this.submit= true;
      },
      (err) => {
        if (err.error.ErrorMessage == 'Learner has exist.') {
          this.showInfoMessage(err.error.ErrorMessage + ' Please check ID Number.', '#dc3545', false);
          this.submitionFlag = true;
        }
        else {
          this.showInfoMessage('Sorry, there are something wrong in server.', '#dc3545', false);
          this.submitionFlag = true;
        }
        console.log('Error', err);
      }
    );
  }

  showInfoMessage(msg, fontColor, gifFlag) {
    this.infoMessage = msg;
    this.loadingGifFlag = gifFlag;
    this.messageColor = fontColor;
  }

  onClose(command,whichLearner) {
    if ( this.submit==true || this.updateFormObj.registrationForm.dirty == true) {
      this.refreshFlag.emit(true);
      if(command == 1){
       //@ts-ignore
      const modalRef = this.modalService.open(RegistrationToParentComponent, { size: 'xl', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.command = command;
      modalRef.componentInstance.newLearner = this.updateFormObj.registrationForm
    }
  }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }
}
