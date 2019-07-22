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
  concertInUse: boolean = true
  noteInUse: boolean = true
  tempNote
  tempConcert
  tempOther1Fee: number = 0
  tempOther2Fee: number = 0
  tempOther3Fee: number = 0
  tempLessonFee: number = 0
  tempConcertFee: number = 20
  tempNoteFee: number = 10;
  item2: any;

  totalFee: number

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
      ConcertFeeName: [{ value: null }],
      ConcertFee: [{ value: null }],
      concertCheckBox: [false],
    }, { validator: this.invoiceValidator.matcher }),
    Note: this.fb.group({
      LessonNoteFeeName: [{ value: null }],
      NoteFee: [{ value: null }],
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
    OwingFee: [null],
    Comment: [null]
  });

  // get quantity
  get LessonQuantity() {
    return this.invoiceEditForm.get('LessonQuantity');
  }

  ngOnInit() {
    if (this.item.Invoice.InvoiceId === 0)
      this.item2 = { ... this.item, ...this.item.InvoiceWaitingConfirm };
    else
      this.item2 = { ... this.item, ...this.item.Invoice };
    this.setDataIfConfirmed()
    this.patchToInvoice();
    this.dueDateLocal = this.item2.DueDate;
    this.owingFeeLocal = this.item2.TotalFee || this.item2.LessonFee;
    this.tempLessonFee = this.item2.LessonFee
    this.getCourse();
    this.getLooksUpData()
  }

  setDataIfConfirmed() {
    if (!this.item2.ConcertFee) {
      this.checkboxOnChange("concertCheckBox")
    } else {
      this.tempConcertFee = this.item2.ConcertFee
      this.invoiceEditForm.get("Concert").get("concertCheckBox").patchValue(true)
    }
    if (!this.item2.NoteFee) {
      this.checkboxOnChange("noteCheckBox")
    } else {
      this.tempNoteFee = this.item2.NoteFee
      this.invoiceEditForm.get("Note").get("noteCheckBox").patchValue(true)
    }
  }

  // get group or 121 course id
  getCourse() {
    let type;
    let courseId = this.item2.CourseInstanceId
    let groupCourseID = this.item2.GroupCourseInstanceId
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
      CourseName: this.item2.CourseName,
      LessonQuantity: this.item2.LessonQuantity,
      BeginDate: this.item2.BeginDate === null ? null : this.item2.BeginDate.slice(0, 10),
      LessonFee: this.item2.LessonFee || 0,
      Concert: {
        ConcertFee: this.item2.ConcertFee,
        ConcertFeeName: this.item2.ConcertFeeName
      },
      Note: {
        NoteFee: this.item2.NoteFee,
        LessonNoteFeeName: this.item2.LessonNoteFeeName
      },
      Other1: {
        Other1FeeName: this.item2.Other1FeeName,
        Other1Fee: this.item2.Other1Fee || 0,
      },
      Other2: {
        Other2FeeName: this.item2.Other2FeeName,
        Other2Fee: this.item2.Other2Fee || 0,
      },
      Other3: {
        Other3FeeName: this.item2.Other3FeeName,
        Other3Fee: this.item2.Other3Fee || 0
      },
      PaidFee: this.item2.PaidFee,
      Comment: this.item2.Comment
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
      WaitingId: this.item2.WaitingId,
      InvoiceNum: this.item2.InvoiceNum,
      LearnerId: this.item2.LearnerId,
      LearnerName: this.item2.LearnerName,
      TermId: this.item2.TermId,
      GroupCourseInstanceId: this.item2.GroupCourseInstanceId,
      CourseInstanceId: this.item2.CourseInstanceId,
      Comment: this.invoiceEditForm.value.Comment
    }
    data.OwingFee = +data.LessonFee + +data.ConcertFee + +data.NoteFee + +data.Other1Fee + +data.Other2Fee + +data.Other3Fee;
    data.TotalFee = data.OwingFee;

    this.itemTempPublic = data
  }

  putInvoiceData() {
    this.transactionService.update(this.itemTempPublic)
      .subscribe(
        (res) => {
          this.activeModal.close();
          swal.fire("Confirmed")
          this.item2.IsConfirmed = 1
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
            ConcertFee: this.item2.ConcertFee || +this.concertData[1].PropName,
            ConcertFeeName: this.item2.ConcertFeeName || this.concertData[0].PropName
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
            NoteFee: this.item2.NoteFee || +this.noteData[1].PropName,
            LessonNoteFeeName: this.item2.LessonNoteFeeName || this.noteData[0].PropName
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
    console.log(fee)
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
