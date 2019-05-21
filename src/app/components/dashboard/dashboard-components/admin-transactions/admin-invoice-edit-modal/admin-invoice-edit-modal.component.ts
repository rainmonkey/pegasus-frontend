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
  itemTempPublic;
  courseData;
  coursePrice;
  originPrice = 0;
  userChosenPrice = 0;

  // activated modal tranfer data
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

  // get quantity
  get LessonQuantity(){
    return this.invoiceEditForm.get('LessonQuantity');
  }

  ngOnInit() {
    this.patchToInvoice();
    this.dueDateLocal = this.item.DueDate;
    this.owingFeeLocal = this.item.OwingFee;
    this.getCourse();
  }
// get group or 121 course id
getCourse(){
  let type;
  let courseId = this.item.CourseInstanceId
  switch (courseId) {
    case null:
      type = 1;
      break;
    default:
      type = 0;
  }
  this.transactionService.GroupOr121(courseId, type)
  .subscribe(
    res => {
      this.courseData = res
      this.coursePrice = res.Data.Course.Price
      console.log(this.courseData)
    },
    error => {
      this.errorMsg = JSON.parse(error.error);
      console.log("Error!", this.errorMsg.ErrorMsg);
      this.errorAlert = false;
    });
}

// patch data to invoiceEditForm
  patchToInvoice() {
    console.log(this.item)
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

  // moniting user change course quantity
  changeQuantity(){
    this.invoiceEditForm.patchValue({
      LessonFee: Number(this.invoiceEditForm.value.LessonQuantity) * Number(this.coursePrice)
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

  // data combination
  combiData (){
    let valueObj = this.invoiceEditForm.value;
    // get rest then re-define all others
    let {
      LessonFee,
      ConcertFee,
      NoteFee,
      Other1Fee,
      Other2Fee,
      Other3Fee,
      ...rest
    } = valueObj;
    let valueTemp = {
      LessonFee : null ? 0 : this.invoiceEditForm.controls.LessonFee.value,
      ConcertFee: null ? 0 : this.invoiceEditForm.controls.ConcertFee.value,
      NoteFee: null ? 0 : this.invoiceEditForm.controls.NoteFee.value,
      Other1Fee: null ? 0 : this.invoiceEditForm.controls.Other1Fee.value,
      Other2Fee: null ? 0 : this.invoiceEditForm.controls.Other2Fee.value,
      Other3Fee: null ? 0 : this.invoiceEditForm.controls.Other3Fee.value
    };
    rest.OwingFee = valueTemp.LessonFee + valueTemp.ConcertFee + valueTemp.NoteFee + valueTemp.Other1Fee + valueTemp.Other2Fee + valueTemp.Other3Fee;
    rest.TotalFee = rest.OwingFee;
    Object.assign(valueTemp, rest);
    let {...itemTemp } = this.item;
    Object.assign(itemTemp, valueTemp);
    this.itemTempPublic = itemTemp;
  }

  putInvoiceData(){
    return this.transactionService.update(this.itemTempPublic)
          .subscribe(
            (res) => {
              console.log(res);
              this.activeModal.dismiss();
              this.router.navigate(['/transaction/success']);
            },
            (error) => {
              console.log(error)
              this.errorMsg = error.error.ErrorMessage;
              console.log(this.errorMsg);
              this.errorAlert = true;
            },
          );
  }

// confirm Modal
  open(confirmModal) {
    this.combiData();
    this.validatePrice();
    this.modalService
    .open(confirmModal)
    .result.then(
      (result) => {
        this.putInvoiceData();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
// validate lesson price
validatePrice(){
  this.originPrice = Number(this.invoiceEditForm.value.LessonQuantity) * Number(this.coursePrice);
  this.userChosenPrice = this.invoiceEditForm.value.LessonFee;
}

  // dismiss reason of modal
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
