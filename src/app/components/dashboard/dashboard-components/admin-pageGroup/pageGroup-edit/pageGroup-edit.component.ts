import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PageGroupService } from 'src/app/services/http/pageGroup.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pageGroup-edit',
  templateUrl: './pageGroup-edit.component.html',
  styleUrls: ['./pageGroup-edit.component.css']
})
export class PageGroupEditComponent implements OnInit {
  public aa:any
  public infoMessage: string = '';
  public messageColor: string;
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;
  public errorMessage: string;
  typeList=''

  @Input() command;
  @Input() whichPageGroup;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj
  constructor(
    public activeModal: NgbActiveModal,
    private pageGroupService: PageGroupService,
  ) { }

  ngOnInit() {
    console.log(this.modalUpdateFormComponentObj)
    // console.log(this.whichPageGroup.PageGroupId)

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
      this.refreshFlag.emit(true);
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
      return valueToSubmit
    }
    else {
      this.infoMessage = 'Please check your input.'
      this.loadingGifFlag = false;
      this.messageColor = '#dc3545';
      this.submitionFlag = true;
      return null;
    }
  }




  /*
   post the data by diffrent api
 */

/*
  after stringify submition string, data is ready to submit
*/
stringifySubmitStr(formValue) {
  this.errorMessage = '';
  this.submitByMode(formValue);
}

submitByMode(formValue) {
  //while push a stream of new data
  if (this.command == 0) {
    this.pageGroupService.addNewPageGroup(formValue).subscribe(
      (res) => {
        Swal.fire({
          title: 'Successfully Add!',
          type: 'success',
          showConfirmButton: true,
        });
        this.activeModal.close();
      },
      (err) => {Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href>Why do I have this issue?</a>'
      });
      this.activeModal.close();

      }
    );
  }
  //while update data
  else if (this.command == 2) {

    console.log(formValue)
    this.pageGroupService.updatePageGroup(formValue, this.whichPageGroup.PageGroupId).subscribe(
      (res) => {
        Swal.fire({
          title: 'Successfully Modify!',
          type: 'success',
          showConfirmButton: true,
        });
        this.activeModal.close();
      },
      (err) => {
        this.backendErrorHandler(err);
        Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: this.errorMessage,
        footer: '<a href>Why do I have this issue?</a>'
      })
      this.activeModal.close();
        
        
      }

    )
    
  }
  


  
}

backendErrorHandler(err) {
  console.warn(err)
  if (err.error.ErrorMessage != null) {
    this.errorMessage = err.error.ErrorMessage;
  }
  else {
    this.errorMessage = 'Error! Please check your input.'
  }
}

}

