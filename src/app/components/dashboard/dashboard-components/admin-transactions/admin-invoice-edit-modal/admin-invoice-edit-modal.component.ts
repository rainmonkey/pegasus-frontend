import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { FormBuilder } from '@angular/forms';
import { PaymentService } from '../../../../../services/http/payment.service';

@Component({
  selector: 'app-admin-invoice-edit-modal',
  templateUrl: './admin-invoice-edit-modal.component.html',
  styleUrls: ['./admin-invoice-edit-modal.component.css'],
})
export class AdminInvoiceEditModalComponent implements OnInit {
  public learnerList;
  public errorMsg;
  public errorAlert = false;
  public errMsgO = false;
  public errMsgM = false;
  public successAlert = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private teachersService: TeachersService,
    private paymentService: PaymentService
    ) {

     }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    InvoiceNum: [],
    DueDate: [],
    CourseName: [],
    LessonQuantity: [],
    BeginDate: [],
    Other1FeeName: [],
    Other2FeeName: [],
    Other3FeeName: [],
    Other1Fee: [],
    Other2Fee: [],
    Other3Fee: [],
    PaidFee: [],
    OwingFee: []
  });

  ngOnInit() {
    this.getInvoiceData();
  }
// get invoice from server
  getInvoiceData() {
    this.teachersService.getTeachers().subscribe(
      (res) => {
        this.learnerList = res.Data;
        //this.patchToInvoice()
      },
      error => {
        this.errorMsg = JSON.parse(error.error);
        console.log('Error!', this.errorMsg.ErrorCode);
        this.errorAlert = false;
      });
  }
// patch data to invoiceEditForm
  patchToInvoice() {
    this.invoiceEditForm.value.patch({

    });
  }

// post data to server side
  sendMail(confirmModal) {
    this.open(confirmModal);
  }

// confirm Modal
  open(confirmModal) {
    this.modalService
    .open(confirmModal)
    .result.then(
      result => {
        this.paymentService.emailInvoice(this.invoiceEditForm.controls.value).subscribe(
          response => {
            console.log('Success!', response);
            this.successAlert = true;
            alert('Your Payment Has Been Made');
          },
          (error) => {
            this.errorMsg = JSON.parse(error.error);
            this.errorAlert = true;
            console.log('Error!', this.errorMsg.ErrorCode);
            alert(this.errorMsg.ErrorCode);
          }
        );
      });
  }
}
