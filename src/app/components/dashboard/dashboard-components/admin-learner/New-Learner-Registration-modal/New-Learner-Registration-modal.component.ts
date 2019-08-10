import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationService } from 'src/app/services/http/learner-registration.service';

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

  getErrorW = false;
  getErrorH = false;
  showErrorW = false;
  showErrorH = false;
  @Input() command
  @Input() whichLeaner;
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
      console.log(valueToSubmit)
      let vailadValue = this.checkInputVailad(valueToSubmit);
      console.log(vailadValue)
      if (vailadValue !== null) {
        // this.sortLearnerOthers()
        this.stringifySubmitStr(vailadValue)

      }
    }
  }

  checkInputVailad(valueToSubmit) {
    console.log(valueToSubmit)
    console.log(this.updateFormObj.registrationForm.status )
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
    console.log(valueToSubmit)
    valueToSubmit.Gender = Number(valueToSubmit.Gender);
    valueToSubmit.LearnerLevel = Number(valueToSubmit.LearnerLevel);
    valueToSubmit.OrgId = Number(valueToSubmit.OrgId)
    valueToSubmit.LearnerOthers = this.updateFormObj.learnerOthers
    return valueToSubmit
  }

  stringifySubmitStr(vailadValue) {
      console.log(vailadValue)
    let submit = new FormData();

    submit.append('details', JSON.stringify(vailadValue));
    submit.append('Photo', this.updateFormObj.selectedPhoto);
    submit.append('G5Certification', this.updateFormObj.selectedGrade);
    submit.append('FormUrl', this.updateFormObj.selectedAgreement);
    submit.append('OtherfileUrl', this.updateFormObj.selectedOther);
    this.submitByMode(submit)
  }

  // sortLearnerOthers() {
  //   this.LearnerOthers = []
  //   let whyP = [];
  //   let howP = [];
  //   console.log(this.updateFormObj.learnPurpose)
  //   for (let learnerPuporse of this.updateFormObj.learnPurpose) {
  //     if (learnerPuporse.isChecked) {
  //       let temObj = {};
  //       temObj['OthersType'] = learnerPuporse.LookupType;
  //       temObj['OthersValue'] = learnerPuporse.PropValue;
  //       whyP.push(temObj);
  //     }
  //   }

  //   for (let how of this.updateFormObj.howKnow) {
  //     if (how.isChecked) {
  //       let tempObj = {};
  //       tempObj['OthersType'] = how.LookupType;
  //       tempObj['OthersValue'] = how.PropValue;
  //       howP.push(tempObj);
  //     }
  //   }
  //   whyP.length === 0 ? this.getErrorW = false : this.getErrorW = true;
  //   howP.length === 0 ? this.getErrorH = false : this.getErrorH = true;
  //   this.getErrorW === false ? this.showErrorW = true : this.showErrorW = false;
  //   this.getErrorH === false ? this.showErrorH = true : this.showErrorH = false;
  //   this.LearnerOthers = whyP.concat(howP)
  //   console.log(this.LearnerOthers)
  //   return this.LearnerOthers

  // }

  submitByMode(submit) {
    if (this.command == 1) {
      let obj = this.learnerRegServer.postStudent(submit)
      this.subscribeHandler(obj);
    }
    else if (this.command == 2) {
      let obj = this.learnerRegServer.putStudent(this.whichLeaner.LearnerId, submit)
      this.subscribeHandler(obj);
    }
  }

  subscribeHandler(obj) {
    obj.subscribe(
      (res) => {
        this.showInfoMessage('Submit success!', '#28a745', false)
        this.submitionFlag = false;
      },
      (err) => {
        if (err.error.ErrorMessage == 'Staff has exist.') {
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


  onClose() {
    if (this.updateFormObj.registrationForm.dirty == true) {
      this.refreshFlag.emit(true);
    }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }
}
