import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialCoursesService } from 'src/app/services/http/trial-courses.service';
import { forkJoin, Observable } from 'rxjs';
import { start } from 'repl';
import { ActivatedRoute } from '@angular/router';
import { DownloadPDFService, IInvoiceLearnerName, IInvoice } from 'src/app/services/others/download-pdf.service';

@Component({
  selector: 'app-trial-confirmation',
  templateUrl: './trial-confirmation.component.html',
  styleUrls: ['../../../../../shared/css/bootstrap-default-clear.css',
    './trial-confirmation.component.css']
})
export class TrialConfirmationComponent implements OnInit {
  private learner;
  private courseName: string;
  private startTimeStr: string;
  private endTimeStr: string;
  private learnerName: string;
  private avaliableRoom;
  private extraFee: number;
  private frequencyRoom: Array<any> = [];
  private coursePrice: number;
  private trialCourseId: number;
  private avaliableCourses: Array<object>;
  private learnerId: number = +(this.routerInfo.snapshot.queryParams.LearnerId || this.routerInfo.snapshot.params.learnerId);
  /**@property {Array<object>} paymentMethods - array saved payment methods */
  private paymentMethods: Array<object>;
  /**@property {boolean} haspaid - show payment method or not */
  private haspaid: boolean = false;
  /**@property {boolean} isSubmitting - is data submitting or not */
  private isSubmitting: boolean = false;
  private isError: boolean = false;
  private isLoading: boolean = false;
  private isSuccess: boolean = false;

  @Input() confirmationData: IConfirmData;
  @Output() isClosed = new EventEmitter();

  constructor(
    private routerInfo: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private trialService: TrialCoursesService,
    private downloadPDFService: DownloadPDFService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.getDataFromServer().subscribe(
      (res) => {
        console.log(res);
        this.processData(res);
        this.isLoading = false;
      },
      (err) => {
        this.isError = true;
      }
    );
  }

  /**
   * Get data from server.
   * @returns {Observable} array of data (avaliableRoom, frequentlyRoom, learner, courses, extrafee)
   */
  getDataFromServer() {
    let apiRequests: Array<any> = [];
    //get avaliable room request
    apiRequests.push(this.trialService.getAvailableRoom(
      this.confirmationData.orgId,
      this.formatDate(this.confirmationData.startStr),
      this.formatDate(this.confirmationData.endStr)
    ));
    //get frequently room request
    apiRequests.push(this.trialService.getTeacherFrequentlyRoom(
      this.confirmationData.teacherId,
      this.confirmationData.orgId,
      this.formatDate(this.confirmationData.startStr),
    ));
    //get learner request
    apiRequests.push(this.trialService.getLearnerById(this.learnerId));
    //get courses request
    apiRequests.push(this.trialService.getCourses());
    //get extra fee request
    apiRequests.push(this.trialService.getExtraFee());

    return forkJoin(apiRequests);
  }

  /**
   * Process data to display.
   * @param dataFromServer - data
   */
  processData(dataFromServer) {
    //data from parents
    let { startTimeStamp, endTimeStamp, cateName } = this.confirmationData;
    //data from server
    let avaliableRoom = dataFromServer[0]['Data'];
    let frequencyRoom = dataFromServer[1]['Data'];
    let learner = dataFromServer[2]['Data'];
    this.learner = learner;
    let courses = dataFromServer[3]['Data'];
    this.extraFee = Number(dataFromServer[4]['Data'][0]['PropName']);
    this.learnerName = learner['FirstName'] + '  ' + learner['LastName'];
    this.startTimeStr = new Date(startTimeStamp).toLocaleTimeString() + ' ' + new Date(startTimeStamp).toLocaleDateString();
    this.endTimeStr = new Date(endTimeStamp).toLocaleTimeString() + ' ' + new Date(endTimeStamp).toLocaleDateString();
    this.courseName = cateName + '  ' + 'Trial  Course';
    this.avaliableRoom = avaliableRoom;

    //判断老师常用教室是否可用
    if (frequencyRoom.length !== 0) {
      avaliableRoom.map(
        (val) => {
          if (val.RoomId == frequencyRoom[0]['RoomId']) {
            this.frequencyRoom.push(val);
          }
        }
      )
    }
    this.avaliableCourses = this.getAvaliableCourses(courses);
    this.coursePrice = this.avaliableCourses[0]['Price'] + this.extraFee;
    this.trialCourseId = this.avaliableCourses[0]['CourseId'];
  }

  /**
   * Calculate the avaliable courses.
   * @param courses - courses object
   */
  getAvaliableCourses(courses: Array<object>) {
    let array: Array<object> = [];
    let durationIndex = this.getDurationIndex(this.confirmationData.startTimeStamp, this.confirmationData.endTimeStamp);
    courses.map(
      (val) => {
        if (val['CourseCategory']['CourseCategoryId'] == this.confirmationData.cateId &&
          val['Duration'] == durationIndex) {
          array.push(val);
        }
      })
    //Piano course(cateId == 1), courses must match teacher's level
    if (this.confirmationData.cateId == 1) {
      let arr: Array<object> = [];
      array.map(
        (val) => {
          if (val['TeacherLevel'] == this.confirmationData.teacher['Level']) {
            arr.push(val);
          }
        }
      )
      array = arr;
    }
    return array;
  }

  /**
   * Display payment methods options when user click 'Pay Now' button.
   */
  displayPayment() {
    if (this.haspaid) {
      this.haspaid = !this.haspaid;
    }
    else {
      this.trialService.getPaymentMethods().subscribe(
        (res) => {
          this.haspaid = !this.haspaid;
          this.paymentMethods = res['Data'];
        }
      )
    }
  }

  /**
   * When user click confirm button, prepare to submit data.
   */
  onSubmit() {
    this.isSubmitting = true;
    let data = this.prepareSubmitionData();
    this.trialService.postTrialCourse(data).subscribe(
      (res) => {
        this.isSubmitting = false;
        this.isError = false;
        this.isSuccess = true;
      },
      (err) => {
        this.isSubmitting = false;
        this.isSuccess = false;
        this.isError = true;
      }
    )
  }

  /**
   * Prepare submition data.
   */
  prepareSubmitionData() {
    let data: IData;
    data = {
      LearnerId: Number(this.learnerId),
      RoomId: Number(this.getRoomIdValue()),
      TeacherId: this.confirmationData.teacherId,
      OrgId: this.confirmationData.orgId,
      BeginTime: this.formatDate(this.confirmationData.startStr),
      EndTime: this.formatDate(this.confirmationData.endStr),
      PaymentMethod: this.getPaymentIdValue(),
      Amount: this.coursePrice,
      StaffId: Number(localStorage.userID),
      TrialCourseId: this.trialCourseId,
      IsPayNow: true
    }
    return data;
  }

  getRoomIdValue() {
    if (this.frequencyRoom.length !== 0) {
      console.log(this.frequencyRoom[0]['RoomId'])
      return this.frequencyRoom[0]['RoomId']
    }
    else {
      let obj = document.getElementById('ROOMS');
      return obj['value'];
    }
  }

  getPaymentIdValue() {
    let id: number;
    let obj = document.getElementsByClassName('PAYMENTS');
    for (let i = 0; i < obj.length; i++) {
      if (obj[i]['checked']) {
        id = Number(obj[i]['id'])
      }
    }
    return id;
  }

  getDurationIndex(startTimeStamp: number, endTimeStamp: number) {
    let timeDiffer: number = endTimeStamp - startTimeStamp;
    let durationIndex: number;
    switch (timeDiffer) {
      case 1800000:
        durationIndex = 1;
        break;
      case 3600000:
        durationIndex = 3;
        break;
      default:
        durationIndex = 2;
        break;
    }
    return durationIndex;
  }

  formatDate(timeStr: string) {
    return timeStr.substr(0, 19);
  }

  /**
   * Course name selection value changed event handler.
   * @param event - selection value changed event
   */
  selectCourse(event) {
    let courseId = Number(event.target.value);
    this.trialCourseId = courseId;
    this.avaliableCourses.map(
      (val) => {
        if (val['CourseId'] == courseId) {
          this.coursePrice = val['Price'] + this.extraFee;
        }
      }
    )
  }

  /**
   * Close confirmation modal and emit to parents to refresh.
   */
  closeConfirmationModal() {
    this.activeModal.close('Close click');
    this.isClosed.emit(true);
  }

  /**
   * Down load invoice.
   */
  downloadInvoice() {
    const learnerName: IInvoiceLearnerName = {
      firstName: this.learner.FirstName,
      lastName: this.learner.LastName
    };
    const invoice: IInvoice = {
      LessonQuantity: 1,
      CourseName: this.confirmationData.cateName,
      BeginDate: new Date(this.confirmationData.startTimeStamp).toLocaleDateString(),
      LessonFee: this.coursePrice,
      Other1Fee: this.extraFee,
      Other1FeeName: 'Trial Course Extra',
      TotalFee: this.coursePrice + this.extraFee,
    };
    this.downloadPDFService.downloadPDF(learnerName, invoice);
  }
}



export interface IConfirmData {
  teacherId: number,
  teacherName: string,
  startTimeStamp: number,
  endTimeStamp: number,
  orgId: number,
  orgName: string,
  cateName: string,
  cateId: number,
  teacher: object,
  startStr: string,
  endStr: string
}

export interface IData {
  LearnerId: number,
  RoomId: number,
  TeacherId: number,
  OrgId: number,
  BeginTime: any,
  EndTime: any,
  PaymentMethod: number,
  Amount: number,
  StaffId: number,
  TrialCourseId: number,
  IsPayNow: boolean,
}
