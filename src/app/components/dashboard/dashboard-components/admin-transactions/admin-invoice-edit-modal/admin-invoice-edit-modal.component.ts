import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
import { TransactionService } from '../../../../../services/http/transaction.service';

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
  public staffId = 3;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService
    ) {

     }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    InvoiceNum: ['00000001'],
    DueDate: ['5-4-2019'],
    CourseName: ['Piano',Validators.required],
    LessonQuantity: ['13',Validators.required],
    BeginDate: ['10-4-2019'],
    LessonFee: [390,Validators.required],
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
    this.transactionService.getLearnerInvo(this.staffId).subscribe(
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
    if (this.invoiceEditForm.invalid){
    this.errMsgM = true;
    } else {
      this.open(confirmModal);
    }
  }

// confirm Modal
  open(confirmModal) {
    this.modalService
    .open(confirmModal)
    .result.then(
      result => {
        this.transactionService.update(this.invoiceEditForm.controls.value)
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
      });
  }
}
