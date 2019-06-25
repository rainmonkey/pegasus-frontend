import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { InvoiceValidatorsService } from "src/app/services/others/invoice-validators.service"
import { LookUpsService } from "src/app/services/http/look-ups.service"
import { restoreView } from '@angular/core/src/render3';
import swal from "sweetalert2"

@Component({
  selector: 'app-admin-invoice-edit-modal',
  templateUrl: './admin-invoice-edit-modal.component.html',
  styleUrls: ['./admin-invoice-edit-modal.component.css'],
})
export class AdminInvoiceEditModalComponent implements OnInit {
  @Output() confirmed = new EventEmitter<boolean>()
  public errorMsg;
  public errorAlert = false;
  public errMsgO = false;
  public errMsgM = false;
  public successAlert = false;
  public staffId = 3;
  closeResult: string;
  dueDateLocal;
  owingFeeLocal: number;
  itemTempPublic;
  courseData;
  coursePrice;
  concertData: Array<any>
  noteData: Array<any>
  originPrice = 0;
  userChosenPrice = 0;
  concertInUse: boolean
  noteInUse: boolean
  tempNote
  tempConcert
  tempOther1Fee: number = 0
  tempOther2Fee: number = 0
  tempOther3Fee: number = 0
  tempLessonFee: number = 0
  tempConcertFee: number = 20
  tempNoteFee: number = 10

  // activated modal tranfer data
  @Input() item;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private transactionService: TransactionService,
    private invoiceValidator: InvoiceValidatorsService,
    private lookUpsService: LookUpsService
  ) { }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    DueDate: [null],
    CourseName: [null, Validators.required],
    LessonQuantity: [null, Validators.required],
    BeginDate: [null],
    LessonFee: [null, Validators.required],
    Concert: this.fb.group({
      ConcertFeeName: [{ value: null, disabled: true }],
      ConcertFee: [{ value: null, disabled: true }],
      concertCheckBox: [false],
    }, { validator: this.invoiceValidator.matcher }),
    Note: this.fb.group({
      LessonNoteFeeName: [{ value: null, disabled: true }],
      NoteFee: [{ value: null, disabled: true }],
      noteCheckBox: [false]
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
    this.owingFeeLocal = this.item.LessonFee;
    this.tempLessonFee = this.item.LessonFee
    this.getCourse();
    this.getLooksUpData()
  }
  // get group or 121 course id
  getCourse() {
    let type;
    let courseId = this.item.CourseInstanceId
    let groupCourseID = this.item.GroupCourseInstanceId
    switch (courseId) {
      case null:
        type = 1;
        courseId = groupCourseID
        break;
      default:
        type = 0;
    }
    this.transactionService.GroupOr121(courseId, type)
      .subscribe(
        res => {
          this.courseData = res
          this.coursePrice = res.Data.Course.Price
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
      LessonFee: this.item.LessonFee || 0,
      Concert: {
        ConcertFee: 0,
        ConcertFeeName: ""
      },
      Note: {
        NoteFee: 0,
        LessonNoteFeeName: ""
      },
      Other1: {
        Other1FeeName: this.item.Other1FeeName,
        Other1Fee: this.item.Other1Fee || 0,
      },
      Other2: {
        Other2FeeName: this.item.Other2FeeName,
        Other2Fee: this.item.Other2Fee || 0,
      },
      Other3: {
        Other3FeeName: this.item.Other3FeeName,
        Other3Fee: this.item.Other3Fee || 0
      },
      PaidFee: this.item.PaidFee
    });
  }

  // moniting user change course quantity
  changeQuantity() {
    this.invoiceEditForm.patchValue({
      LessonFee: Number(this.invoiceEditForm.value.LessonQuantity) * Number(this.coursePrice)
    });
    this.feeOnChange("LessonFee")
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
      DueDate: this.dueDateLocal,
      LessonFee: this.invoiceEditForm.value.LessonFee,
      LessonQuantity: this.invoiceEditForm.value.LessonQuantity,
      OwingFee: this.invoiceEditForm.value.OwingFee,
      PaidFee: this.invoiceEditForm.value.PaidFee,
      ...this.invoiceEditForm.getRawValue().Concert,
      ...this.invoiceEditForm.getRawValue().Note,
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

    data.OwingFee = +data.LessonFee + +data.ConcertFee + +data.NoteFee + +data.Other1Fee + +data.Other2Fee + +data.Other3Fee;
    data.TotalFee = data.OwingFee;

    this.itemTempPublic = data
    console.log(this.itemTempPublic);
  }

  putInvoiceData() {
    this.transactionService.update(this.itemTempPublic)
      .subscribe(
        (res) => {
          this.activeModal.dismiss();
          swal.fire("Confirmed")
          this.item.IsConfirmed = 1
          console.log(this.itemTempPublic)
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

  getLooksUpData() {
    this.lookUpsService.getLookUps(15).subscribe(
      res => {
        this.concertData = res["Data"]
        this.tempConcert = {
          Concert: {
            ConcertFee: +this.concertData[1].PropName,
            ConcertFeeName: this.concertData[0].PropName
          }
        }
      },
      error => {
        console.log(error)
      })

    this.lookUpsService.getLookUps(16).subscribe(
      res => {
        this.noteData = res["Data"]
        this.tempNote = {
          Note: {
            NoteFee: +this.noteData[1].PropName,
            LessonNoteFeeName: this.noteData[0].PropName
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  checkboxOnChange(formControlName: string) {
    if (formControlName == "concertCheckBox") {
      if (this.concertInUse) {
        this.invoiceEditForm.get("Concert.ConcertFeeName").disable()
        this.invoiceEditForm.get("Concert.ConcertFee").disable()
        this.invoiceEditForm.get("Concert.ConcertFeeName").patchValue("")
        this.invoiceEditForm.get("Concert.ConcertFee").patchValue(0)
        this.owingFeeLocal -= this.tempConcertFee
      }
      if (!this.concertInUse) {
        this.invoiceEditForm.get("Concert.ConcertFeeName").enable()
        this.invoiceEditForm.get("Concert.ConcertFee").enable()
        this.invoiceEditForm.patchValue(this.tempConcert)
        this.owingFeeLocal += +this.tempConcert.Concert.ConcertFee
      }
      this.concertInUse = !this.concertInUse
    } else if (formControlName == "noteCheckBox") {
      if (this.noteInUse) {
        this.invoiceEditForm.get("Note.LessonNoteFeeName").disable()
        this.invoiceEditForm.get("Note.NoteFee").disable()
        this.invoiceEditForm.get("Note.LessonNoteFeeName").patchValue("")
        this.invoiceEditForm.get("Note.NoteFee").patchValue(0)
        this.owingFeeLocal -= this.tempNoteFee
      }
      if (!this.noteInUse) {
        this.invoiceEditForm.get("Note.LessonNoteFeeName").enable()
        this.invoiceEditForm.get("Note.NoteFee").enable()
        this.invoiceEditForm.patchValue(this.tempNote)
        this.owingFeeLocal += +this.tempNote.Note.NoteFee
      }
      this.noteInUse = !this.noteInUse
    }
  }

  feeOnChange(feeControlName: string, groupName?: string, ) {
    let fee: number = 0
    if (groupName) {
      fee = +this.invoiceEditForm.get(groupName).get(feeControlName).value
    } else {
      fee = +this.invoiceEditForm.get(feeControlName).value
    }
    switch (feeControlName) {
      case "Other1Fee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempOther1Fee
        this.tempOther1Fee = fee
        break;
      case "Other2Fee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempOther2Fee
        this.tempOther2Fee = fee
        break;
      case "Other3Fee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempOther3Fee
        this.tempOther3Fee = fee
        break;
      case "NoteFee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempNoteFee
        this.tempNoteFee = fee
        break;
      case "ConcertFee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempConcertFee
        this.tempConcertFee = fee
        break;
      case "LessonFee":
        this.owingFeeLocal = this.owingFeeLocal + fee - this.tempLessonFee
        this.tempLessonFee = fee
        break;
    }
  }

}
