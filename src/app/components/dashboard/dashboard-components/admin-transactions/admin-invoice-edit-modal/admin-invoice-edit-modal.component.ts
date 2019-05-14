import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
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
    private paymentService: PaymentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {

     }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    InvoiceNum: ['00000001'],
    DueDate: ['5-4-2019'],
    CourseName: ['Piano'],
    LessonQuantity: ['13'],
    BeginDate: ['10-4-2019'],
    LessonFee: [390],
    Concert: ['Concert for term 2, 2019'],
    ConcertFee: ['15'],
    Note: ['Lesson Note Term 2, 2019'],
    NoteFee: [3],
    Other1FeeName: ['Enroll Fee'],
    Other2FeeName: [],
    Other3FeeName: [],
    Other1Fee: [20],
    Other2Fee: [],
    Other3Fee: [],
    PaidFee: [],
    OwingFee: [428]
  });

  ngOnInit() {
    this.getInvoiceData();
  }
// get invoice from server
  getInvoiceData() {
    this.teachersService.getTeachersInfo().subscribe(
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
  // close alert
  closeSucc(){
    this.successAlert = false;
  }
  closeErro(){
    this.errorAlert = false;
  }

// post data to server side
  sendMail(confirmModal) {
    this.open(confirmModal);
    this.paymentService.emailInvoice(this.invoiceEditForm.value)
    .subscribe(
      (res) => {
        this.router.navigate(['../success'], {relativeTo: this.activatedRoute});
      },
      (error) => {
        this.errorMsg = JSON.parse(error.error);
        this.errorAlert = true;
        alert(this.errorMsg.ErrorCode);
      }
    );
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
