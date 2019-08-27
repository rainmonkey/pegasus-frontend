import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  public loadingGifFlag: boolean;
  public errorMessage: string;
  public comment: string;

  constructor(
    public activeModal: NgbActiveModal,
    private adminpaymentlistService: AdminpaymentlistService
  ) { }

  ngOnInit() { }

  onSubmit() {
    if (this.comment !== undefined && this.comment !== "") {
      this.loadingGifFlag = true;
      this.submitByMode(this.comment);
    } else {
      this.submitByMode("confirmed");
    }
  }
  submitByMode(formValue) {
    this.adminpaymentlistService.updateConfirm(this.adminPaymentList.PaymentId, formValue).subscribe(
      (res) => {
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
      },
      (err) => {
        this.backendErrorHandler(err);
      }
    )
  }
  // Show error message
  backendErrorHandler(err) {
    if (err.message != null) {
      this.errorMessage = err.message;
      console.log(this.errorMessage)
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }
}
