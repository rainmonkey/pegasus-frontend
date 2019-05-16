import { Component, OnInit, Input, Output } from '@angular/core';
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
  public errorMsg;
  public errorAlert = false;
  public errMsgO = false;
  public errMsgM = false;
  public successAlert = false;
  public staffId = 3;

  @Input() item;

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
    DueDate: [null],
    CourseName: [null, Validators.required],
    LessonQuantity: [null, Validators.required],
    BeginDate: [null],
    LessonFee: [null, Validators.required],
    Concert: [null],
    ConcertFee: [null],
    Note: [null],
    NoteFee: [null],
    Other1FeeName: [null],
    Other2FeeName: [null],
    Other3FeeName: [null],
    Other1Fee: [null],
    Other2Fee: [null],
    Other3Fee: [null],
    PaidFee: [null],
    OwingFee: [null]
  });

  ngOnInit() {
    this.patchToInvoice();
  }

// patch data to invoiceEditForm
  patchToInvoice() {
    this.invoiceEditForm.patchValue({
      DueDate: this.item.DueDate,
      CourseName: this.item.CourseName,
      LessonQuantity: this.item.LessonQuantity,
      BeginDate: this.item.BeginDate,
      LessonFee: this.item.LessonFee,
      Concert: this.item.Concert,
      ConcertFee: this.item.ConcertFee,
      Note: this.item.Note,
      NoteFee: this.item.NoteFee,
      Other1FeeName: this.item.Other1FeeName,
      Other2FeeName: this.item.Other2FeeName,
      Other3FeeName: this.item.Other3FeeName,
      Other1Fee: this.item.Other1Fee,
      Other2Fee: this.item.Other2Fee,
      Other3Fee: this.item.Other3Fee,
      PaidFee: this.item.PaidFee,
      OwingFee: this.item.OwingFee
    });
  }

  closeSucc() {
    this.successAlert = false;
  }
  closeErro() {
    this.errorAlert = false;
  }

// post data to server side
  sendMail(confirmModal) {
    if (this.invoiceEditForm.invalid) {
    this.errMsgM = true;
    } else {
      this.open(confirmModal);
    }
  }

// confirm Modal
  open(confirmModal) {
    console.log(this.router);
    let {...itemTemp } = this.item;
    Object.assign(itemTemp, this.invoiceEditForm.value);
    console.log(itemTemp)
    this.modalService
    .open(confirmModal)
    .result.then(
      (result) => {
        this.transactionService.update(itemTemp)
        .subscribe(
          (res) => {
            console.log(res);
            this.router.navigate(['/transaction/success']);
          },
          (error) => {
            this.errorMsg = JSON.parse(error.error);
            this.errorAlert = true;
            alert(this.errorMsg.ErrorCode);
          },
        );
      });
  }

}
