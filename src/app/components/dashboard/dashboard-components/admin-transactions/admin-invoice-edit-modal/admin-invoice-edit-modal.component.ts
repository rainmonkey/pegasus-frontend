import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { InvoiceValidatorsService } from "src/app/services/others/invoice-validators.service"
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
    private transactionService: TransactionService,
    private invoiceValidator: InvoiceValidatorsService
  ) {

  }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    DueDate: [null],
    CourseName: [null, Validators.required],
    LessonQuantity: [null, Validators.required],
    BeginDate: [null],
    LessonFee: [null, Validators.required],
    Concert: this.fb.group({
      ConcertFeeName: [null],
      ConcertFee: [null]
    }, { validator: this.invoiceValidator.matcher }),
    Note: this.fb.group({
      NoteFeeName: [null],
      NoteFee: [null]
    }, { validator: this.invoiceValidator.matcher }),
    Other1: this.fb.group({
      Other1FeeName: [null],
      Other1Fee: [null]
    }, { validator: this.invoiceValidator.matcher }),
    Other2: this.fb.group({
      Other2FeeName: [null],
      Other2Fee: [null]
    }, { validator: this.invoiceValidator.matcher }),
    Other3: this.fb.group({
      Other3FeeName: [null],
      Other3Fee: [null]
    }, { validator: this.invoiceValidator.matcher }),
    PaidFee: [null],
    OwingFee: [null]
  });

  // get quantity
  get LessonQuantity() {
    return this.invoiceEditForm.get('LessonQuantity');
  }

  ngOnInit() {
    this.patchToInvoice();
    this.dueDateLocal = this.item.DueDate;
    this.owingFeeLocal = this.item.OwingFee;
    this.getCourse();
  }
  // get group or 121 course id
  getCourse() {
    let type;
    let courseId = this.item.CourseInstanceId
    console.log(type, courseId)
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
    this.invoiceEditForm.patchValue({
      CourseName: this.item.CourseName,
      LessonQuantity: this.item.LessonQuantity,
      BeginDate: this.item.BeginDate === null ? null : this.item.BeginDate.slice(0, 10),
      LessonFee: this.item.LessonFee,
      Concert: {
        ConcertFeeName: this.item.ConcertFeeName,
        ConcertFee: this.item.ConcertFee
      },
      Note: {
        NoteFeeName: this.item.Note,
        NoteFee: this.item.NoteFee
      },
      Other1: {
        Other1FeeName: this.item.Other1FeeName,
        Other1Fee: this.item.Other1Fee,
      },
      Other2: {
        Other2FeeName: this.item.Other2FeeName,
        Other2Fee: this.item.Other2Fee,
      },
      Other3: {
        Other3FeeName: this.item.Other3FeeName,
        Other3Fee: this.item.Other3Fee
      },
      PaidFee: this.item.PaidFee
    });
  }

  // moniting user change course quantity
  changeQuantity() {
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
  combiData() {
    let data = {
      BeginDate: this.invoiceEditForm.value.BeginDate,
      CourseName: this.invoiceEditForm.value.CourseName,
      DueDate: this.invoiceEditForm.value.DueDate,
      LessonFee: this.invoiceEditForm.value.LessonFee || 0,
      LessonQuantity: this.invoiceEditForm.value.LessonQuantity,
      OwingFee: this.invoiceEditForm.value.OwingFee,
      PaidFee: this.invoiceEditForm.value.PaidFee,
      ...this.invoiceEditForm.value.Concert,
      ...this.invoiceEditForm.value.Note,
      ...this.invoiceEditForm.value.Other1,
      ...this.invoiceEditForm.value.Other2,
      ...this.invoiceEditForm.value.Other3,
      WaitingId: this.item.WaitingId,
      InvoiceNum: this.item.InvoiceNum,
      LearnerId: this.item.LearnerId,
      LearnerName: this.item.LearnerName,
      TermId: this.item.TermId,
      GroupCourseInstanceId: this.item.GroupCourseInstanceId,
      CourseInstanceId: this.item.CourseInstanceId
    }

    data.ConcertFee = data.ConcertFee || 0
    data.NoteFee = data.NoteFee || 0
    data.Other1Fee = data.Other1Fee || 0
    data.Other2Fee = data.Other2Fee || 0
    data.Other3Fee = data.Other3Fee || 0

    data.OwingFee = data.LessonFee + data.ConcertFee + data.NoteFee + data.Other1Fee + data.Other2Fee + data.Other3Fee;
    data.TotalFee = data.OwingFee;

    this.itemTempPublic = data

    console.log(data);
  }

  putInvoiceData() {
    console.log(this.itemTempPublic);
    this.transactionService.update(this.itemTempPublic)
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
  validatePrice() {
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
      return `with: ${reason}`;
    }
  }

}
