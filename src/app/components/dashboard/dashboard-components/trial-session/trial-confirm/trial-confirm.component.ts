import { LookUpsService } from 'src/app/services/http/look-ups.service';
import { CoursesService } from 'src/app/services/http/courses.service';
import { Component, OnInit, Input, Output, ViewChildren, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadPDFService, IInvoiceLearnerName, IInvoice } from 'src/app/services/others/download-pdf.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trial-confirm',
  templateUrl: './trial-confirm.component.html',
  styleUrls: ['./trial-confirm.component.css']
})
export class TrialConfirmComponent implements OnInit {
  public paymentMethods: Array<any> = [];
  public trialCoursePrice;
  @Input() startTime;
  @Input() endTime;
  @Input() orgName;
  @Input() orgId;
  @Input() cateName;
  @Input() cateId;
  @Input() teacherDetails;
  @Input() coursePrice;
  @Input() learnerId;
  @Input() courseId;
  @Input() studentFullName;
  // arrange
  @Input() arrangeFlag;
  @Input() arrangeCourseInstance;

  @ViewChildren('radios') radios;
  @Output() closeModalFlag: EventEmitter<any> = new EventEmitter();

  public whichTeacherFullName;
  public paymentMethodValue = null;
  public startTimeTem;
  public endTimeTem;
  public avaliableRoom;
  public error = false;
  public loadingGifFlag = false;
  public successFlag = false;
  public extraFee: number;
  public extraFeeName: string;
  private isPayNow = true;

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private lookupsService: LookUpsService,
              private CoursesService: CoursesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private downloadPDFService: DownloadPDFService
  ) { }

  ngOnInit() {
    this.startTimeTem = this.timeFormatting(this.startTime);
    this.endTimeTem = this.timeFormatting(this.endTime);
    this.whichTeacherFullName = this.teacherDetails.FirstName + ' ' + this.teacherDetails.LastName;
    this.getDataFromServer();
  }

  getDataFromServer() {
    const LookUpsService7 = this.lookupsService.getLookUps(7);
    const RoomAvailableCheckService = this.CoursesService.getAvailableRoom(this.orgId, this.startTime, this.endTime);
    const LookUpsService17 = this.lookupsService.getLookUps(17);

    forkJoin([LookUpsService7, RoomAvailableCheckService, LookUpsService17]).subscribe(
      (res) => {
        this.paymentMethods = res[0].Data;
        const allAvaliableRoom = res[1].Data;
        const extraFee = res[2].Data;
        this.getExtraFee(extraFee);
        this.assignRandomRoom(allAvaliableRoom);
      },
      (err) => {
        // alert('Sorry, something went wrong.')
        Swal.fire({ type: 'error', title: 'Oops...', text: 'Sorry, something went wrong' + err.error.ErrorMessage });
      }
    );
  }

  assignRandomRoom(allAvaliableRoom) {
    const length = allAvaliableRoom.length;
    const randomNum = Math.floor(Math.random() * length) + 1;
    this.avaliableRoom = allAvaliableRoom[randomNum];
    // console.log(this.avaliableRoom)
  }

  getExtraFee(extraFee) {
    for (const i of extraFee) {
      if (i.PropValue == 1) {
        this.extraFee = Number(i.PropName);
        this.extraFeeName = i.Description;
      }
    }

    this.trialCoursePrice = this.coursePrice + this.extraFee;
  }

  timeFormatting(time) {
    return time.replace('T', '  ');
  }


  getRadioValue(value) {
    this.paymentMethodValue = value;
  }

  onSubmit() {
    if ((this.paymentMethodValue == null && this.isPayNow) && !this.arrangeFlag) {
      this.error = true;
      return;
    } else {
      this.error = false;
    }

    this.loadingGifFlag = true;
    if (this.arrangeFlag) {
      const dataToSubmit = this.prepareArrangeData();
      console.log(dataToSubmit);
      this.CoursesService.arrangeCourse(localStorage.userID, dataToSubmit).subscribe(
        res => {
          this.loadingGifFlag = false;
          this.successFlag = true;
        },
        err => {
          console.log(localStorage.userID, dataToSubmit, err);
          this.loadingGifFlag = false;
        },
      );

    } else {
      const dataToSubmit = this.prepareTrialData();
      this.CoursesService.postTrialLesson(dataToSubmit).subscribe(
        (res) => {
          this.loadingGifFlag = false;
          this.successFlag = true;
        },
        (err) => {
          console.log(err);
          this.loadingGifFlag = false;
          // alert('Sorry,something went wrong in server.');
          Swal.fire({ type: 'error', title: 'Oops...', text: 'Sorry, something went wrong' + err.error.ErrorMessage });
        }
      );
    }
  }

  prepareArrangeData() {
    console.log(Number(this.learnerId));
    const data = {
      LearnerId: Number(this.learnerId),
      RoomId: this.avaliableRoom.RoomId,
      TeacherId: this.teacherDetails.TeacherId,
      OrgId: this.orgId,
      BeginTime: this.startTime,
      Reason: 'arrange course',
      CourseInstanceId: this.arrangeCourseInstance.CourseInstanceId
    };
    return data;
  }

  prepareTrialData() {
    const obj = {
      LearnerId: Number(this.learnerId),
      RoomId: this.avaliableRoom.RoomId,
      TeacherId: this.teacherDetails.TeacherId,
      OrgId: this.orgId,
      BeginTime: this.startTime,
      EndTime: this.endTime,
      PaymentMethod: this.paymentMethodValue,
      Amount: this.coursePrice + this.extraFee,
      StaffId: Number(localStorage.userID),
      TrialCourseId: this.courseId,
      IsPayNow: this.isPayNow,
    };
    return obj;
  }

  closeModal() {
    this.closeModalFlag.emit(true);
    this.activeModal.close('Cross click');
    if (!this.arrangeFlag) {
      this.router.navigate(['/learner/list']);
    } else if (this.arrangeFlag) {
      this.router.navigate(['/learner/credit/', this.learnerId]);
    }
  }

  downloadPDFReady() {
    const learnerName = {} as IInvoiceLearnerName;
    learnerName.firstName = this.studentFullName.split(' ')[0];
    learnerName.lastName = this.studentFullName.split(' ')[1];
    const invoice = {} as IInvoice;
    invoice.LessonQuantity = 1;
    invoice.CourseName = this.cateName;
    invoice.BeginDate = this.startTime;
    invoice.LessonFee = this.coursePrice;
    invoice.Other1Fee = this.extraFee;
    invoice.Other1FeeName = this.extraFeeName;
    invoice.TotalFee = this.coursePrice + this.extraFee;
    this.downloadPDFService.downloadPDF(learnerName, invoice);
  }
}
