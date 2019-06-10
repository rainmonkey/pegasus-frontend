import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffListService } from 'src/app/services/http/staff-list.service';


@Component({
  selector: 'app-staff-edit-modal',
  templateUrl: './staff-edit-modal.component.html',
  styleUrls: ['./staff-edit-modal.component.css']
})
export class StaffEditModalComponent implements OnInit {
  public infoMessage: string = '';
  public messageColor: string;
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;


  @Input() command;
  @Input() whichStaff;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj
  constructor(
    public activeModal: NgbActiveModal,
    private staffService: StaffListService,
  ) { }

  ngOnInit() {
    console.log(this.modalUpdateFormComponentObj)
  }
  onClose() {
    if (this.modalUpdateFormComponentObj.updateForm.dirty == true ) {
      this.refreshFlag.emit(true);
    }
    else {
      this.refreshFlag.emit(false);
    }
    this.activeModal.close('Cross click');
  }

  onSubmit() {
    console.log(this.modalUpdateFormComponentObj.updateForm)
    if (this.modalUpdateFormComponentObj.updateForm.dirty == true) {
      this.submitionFlag = false;
      this.infoMessage = 'loading.....'
      this.loadingGifFlag = true;
      let valueToSubmit = this.modalUpdateFormComponentObj.updateForm.value;
      let vailadValue = this.checkInputVailad(valueToSubmit);
      if (vailadValue !== null) {
        this.stringifySubmitStr(vailadValue)
      }
    }
    else {
      this.infoMessage = 'Value has not changed.'
      return;
    }
  }

  checkInputVailad(valueToSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.modalUpdateFormComponentObj.updateForm.controls) {
      this.modalUpdateFormComponentObj.updateForm.controls[i].touched = true;
    }
    //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
    if (this.modalUpdateFormComponentObj.updateForm.status == 'VALID') {
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
    valueToSubmit.IdType = Number(valueToSubmit.IdType);
    valueToSubmit.Gender = Number(valueToSubmit.Gender);
    valueToSubmit.RoleId = Number(valueToSubmit.RoleId);
    valueToSubmit.StaffOrg = this.checkOrgs();
    return valueToSubmit;
  }
  /*
      after stringify submition string, data is ready to submit
    */
  stringifySubmitStr(vailadValue) {
    let submit = new FormData();
    submit.append('details', JSON.stringify(vailadValue));
    submit.append('Photo', this.modalUpdateFormComponentObj.PhotoToSubmit);
    submit.append('IdPhoto', this.modalUpdateFormComponentObj.IdPhotoToSubmit);
    this.submitByMode(submit)
  }

  /*
   post the data by diffrent api
 */
  submitByMode(submitData) {
    //while push a stream of new data
    if (this.command == 0) {
      let obj = this.staffService.addNew(submitData);
      this.subscribeHandler(obj);
    }
    //while update data
    else if (this.command == 2) {
      let obj = this.staffService.update(submitData, this.whichStaff.StaffId);
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

  checkOrgs() {
    let temBranches = this.modalUpdateFormComponentObj.branchesCheckBox._results;
    console.log(temBranches)
    let temBranchesList=[]
    for (let i of temBranches) {
      console.log(temBranchesList)
      if (i.nativeElement.checked == true) {
        temBranchesList.push({"OrgId":Number(i.nativeElement.defaultValue)})

      }
    }
    return temBranchesList
  }

}
