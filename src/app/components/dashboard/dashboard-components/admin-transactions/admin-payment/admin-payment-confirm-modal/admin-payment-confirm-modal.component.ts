import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminpaymentlistService } from '../../../../../../services/http/adminpaymentlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-payment-confirm-modal',
  templateUrl: './admin-payment-confirm-modal.component.html',
  styleUrls: ['./admin-payment-confirm-modal.component.css']
})
export class AdminPaymentConfirmModalComponent implements OnInit {
  @Input() adminPaymentList;
  @Output() refreshFlag: EventEmitter<any> = new EventEmitter();
  public updateForm: FormGroup;
  public loadingGifFlag: boolean;
  public errorMessage: string;

  constructor(
    public activeModal: NgbActiveModal,
    private adminpaymentlistService: AdminpaymentlistService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group(this.formGroupAssemble());
  }
  formGroupAssemble() {
    let groupObj: any;
    groupObj = {
      IsConfirmed: [null, Validators.required],
      Comment: [null]
    }
    return groupObj;
  }
  onSubmit() {
    // console.log(this.updateForm.value)
    let valueToSubmit = this.updateForm.value;
    if (valueToSubmit !== null && this.updateForm.dirty) {
      this.loadingGifFlag = true;
      this.submitByMode(valueToSubmit);
    }
  }
  submitByMode(formValue) {
    // 存不进去
    // console.log(formValue)
    this.adminpaymentlistService.updateConfirm(formValue, this.adminPaymentList.PaymentId).subscribe(
      (res) => {
        // console.log(res)
        Swal.fire({
          title: 'Successfully Modify!',
          type: 'success'
        }).then(okay => {
          if (okay) {
            this.refreshFlag.emit(true);
          }
        }
        )
        this.activeModal.close();
        // this.adminPaymentList;
      },
      (err) => {
        this.backendErrorHandler(err);
        // console.log(err);
      }
    )
  }
  // Show error message
  backendErrorHandler(err) {
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }
}
