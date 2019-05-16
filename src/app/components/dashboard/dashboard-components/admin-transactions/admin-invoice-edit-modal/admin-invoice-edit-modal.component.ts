import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { restoreView } from '@angular/core/src/render3';

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
  closeResult: string;
  dueDateLocal;
  owingFeeLocal;

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
    Other1FeeName: [' '],
    Other2FeeName: [' '],
    Other3FeeName: [' '],
    Other1Fee: [],
    Other2Fee: [],
    Other3Fee: [],
    PaidFee: [null],
    OwingFee: [null]
  });

  ngOnInit() {
    this.patchToInvoice();
    this.dueDateLocal = this.item.DueDate;
    this.owingFeeLocal = this.item.OwingFee;
  }

// patch data to invoiceEditForm
  patchToInvoice() {
    this.invoiceEditForm.patchValue({
      CourseName: this.item.CourseName,
      LessonQuantity: this.item.LessonQuantity,
      BeginDate: this.item.BeginDate === null ? null : this.item.BeginDate.slice(0, 10),
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
      PaidFee: this.item.PaidFee
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
    let valueObj = this.invoiceEditForm.value;
    let {
      LessonFee,
      ConcertFee,
      Other1Fee,
      Other2Fee,
      Other3Fee,
      ...rest
    } = valueObj;
    let valueTemp = {
      LessonFee : null ? 0 : this.invoiceEditForm.controls.LessonFee.value,
      ConcertFee: null ? 0 : this.invoiceEditForm.controls.ConcertFee.value,
      Other1Fee: null ? 0  : this.invoiceEditForm.controls.Other1Fee.value,
      Other2Fee: null ? 0 : this.invoiceEditForm.controls.Other2Fee.value,
      Other3Fee: null ? 0 : this.invoiceEditForm.controls.Other3Fee.value,
    };
    Object.assign(valueTemp, rest);
    console.log(valueTemp);
    let {...itemTemp } = this.item;
    Object.assign(itemTemp, valueTemp);
    this.modalService
    .open(confirmModal)
    .result.then(
      (result) => {
        this.transactionService.update(itemTemp)
        .subscribe(
          (res) => {
            console.log(res);
            this.activeModal.dismiss();
            this.router.navigate(['/transaction/success']);
          },
          (error) => {
            this.errorMsg = JSON.parse(error.error);
            this.errorAlert = true;
            alert(this.errorMsg.ErrorCode);
          },
        );
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
