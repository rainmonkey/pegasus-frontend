import { style } from "@angular/animations";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CoursesService } from "src/app/services/http/courses.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TrialCoursesService } from "src/app/services/http/trial-courses.service";
import { forkJoin } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DownloadPDFService,
  IInvoiceLearnerName,
  IInvoice
} from "src/app/services/others/download-pdf.service";

@Component({
  selector: "app-trial-confirmation",
  templateUrl: "./trial-confirmation.component.html",
  styleUrls: [
    "../../../../../shared/css/bootstrap-default-clear.css",
    "./trial-confirmation.component.css"
  ]
})
export class TrialConfirmationComponent implements OnInit {
  @Input() confirmationData: IConfirmData;
  @Output() isClosed = new EventEmitter();

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
  private learnerId: number;

  /**@property {Array<object>} paymentMethods - array saved payment methods */
  private paymentMethods: Array<object>;
  /**@property {boolean} haspaid - show payment method or not */
  private haspaid: boolean = false;
  private isPayNow = false;
  /**@property {boolean} isSubmitting - is data submitting or not */
  private isSubmitting: boolean = false;
  private isError: boolean = false;
  public isLoading: boolean = false;
  private isSuccess: boolean = false;

  constructor(
    private routerInfo: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private trialService: TrialCoursesService,
    private downloadPDFService: DownloadPDFService,
    private courseService: CoursesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.learnerId = +(
      this.confirmationData.LearnerId ||
      this.routerInfo.snapshot.queryParams.LearnerId ||
      this.routerInfo.snapshot.params.learnerId
    );
    this.isLoading = true;
    this.getDataFromServer().subscribe(
      res => {
        this.processData(res);
        this.isLoading = false;
      },
      err => {
        this.isError = true;
      }
    );
  }

  /**
   * Get data from server.
   * @returns {Observable} array of data (avaliableRoom, frequentlyRoom, learner, courses, extrafee)
   */
  getDataFromServer() {
    const apiRequests: Array<any> = [];
    // get avaliable room request
    apiRequests.push(
      this.trialService.getAvailableRoom(
        this.confirmationData.orgId,
        this.formatDate(this.confirmationData.startStr),
        this.formatDate(this.confirmationData.endStr)
      )
    );
    // get frequently room request
    apiRequests.push(
      this.trialService.getTeacherFrequentlyRoom(
        this.confirmationData.teacherId,
        this.confirmationData.orgId,
        this.formatDate(this.confirmationData.startStr)
      )
    );
    // get learner request
    apiRequests.push(this.trialService.getLearnerById(this.learnerId));
    // get courses request
    apiRequests.push(this.trialService.getCourses());
    // get extra fee request
    apiRequests.push(this.trialService.getExtraFee());

    return forkJoin(apiRequests);
  }

  /**
   * Process data to display.
   * @param dataFromServer - data
   */
  processData(dataFromServer) {
    // data from parents
    const { startTimeStamp, endTimeStamp, cateName } = this.confirmationData;
    // data from server
    const avaliableRoom = dataFromServer[0]["Data"];
    const frequencyRoom = dataFromServer[1]["Data"];
    const learner = dataFromServer[2]["Data"];
    this.learner = learner;
    const courses = dataFromServer[3]["Data"];
    this.extraFee = Number(dataFromServer[4]["Data"][0]["PropName"]);
    this.learnerName = learner["FirstName"] + "  " + learner["LastName"];
    this.startTimeStr =
      new Date(startTimeStamp).toLocaleTimeString() +
      " " +
      new Date(startTimeStamp).toLocaleDateString();
    this.endTimeStr =
      new Date(endTimeStamp).toLocaleTimeString() +
      " " +
      new Date(endTimeStamp).toLocaleDateString();
    this.courseName = cateName + "  " + "Trial  Course";
    this.avaliableRoom = avaliableRoom;

    // 判断老师常用教室是否可用
    if (frequencyRoom.length !== 0) {
      avaliableRoom.map(val => {
        if (val.RoomId == frequencyRoom[0]["RoomId"]) {
          this.frequencyRoom.push(val);
        }
      });
    }
    this.avaliableCourses = this.getAvaliableCourses(courses);
    this.coursePrice = this.avaliableCourses[0]["Price"] + this.extraFee;
    this.trialCourseId = this.avaliableCourses[0]["CourseId"];
  }

  /**
   * Calculate the avaliable courses.
   * @param courses - courses object
   */
  getAvaliableCourses(courses: Array<object>) {
    let array: Array<object> = [];
    const durationIndex = this.getDurationIndex(
      this.confirmationData.startTimeStamp,
      this.confirmationData.endTimeStamp
    );
    courses.map(val => {
      if (
        val["CourseCategory"]["CourseCategoryId"] ==
          this.confirmationData.cateId &&
        val["Duration"] == durationIndex
      ) {
        array.push(val);
      }
    });
    // Piano course(cateId == 1), courses must match teacher's level
    if (this.confirmationData.cateId == 1) {
      const arr: Array<object> = [];
      array.map(val => {
        if (val["TeacherLevel"] == this.confirmationData.teacher["Level"]) {
          arr.push(val);
        }
      });
      array = arr;
    }
    if (this.confirmationData.arrangeFlag) {
      array = array.filter(
        el => el["Level"] === this.confirmationData.courseLevel
      );
    }
    return array;
  }

  /**
   * Display payment methods options when user click 'Pay Now' button.
   */
  displayPayment() {
    if (this.isPayNow) {
      this.isPayNow = false;
    }
    if (this.haspaid) {
      this.haspaid = !this.haspaid;
    } else {
      this.trialService.getPaymentMethods().subscribe(res => {
        this.haspaid = !this.haspaid;
        this.paymentMethods = res["Data"];
      });
    }
  }

  /**
   * Select the payment method
   * @param event - event obj
   */
  selectPaymentMethod(event) {
    this.isPayNow = true;
  }
  /**
   * When user click confirm button, prepare to submit data.
   */
  onSubmit(event) {
    event.target.disabled = true;
    this.isSubmitting = true;
    const data = this.prepareSubmitionData();
    if (!this.confirmationData.arrangeFlag) {
      this.trialService.postTrialCourse(data).subscribe(
        res => {
          this.isSubmitting = false;
          this.isError = false;
          this.isSuccess = true;
        },
        err => {
          this.isSubmitting = false;
          this.isSuccess = false;
          this.isError = true;
          event.target.disabled = false;
        }
      );
    } else {
      this.courseService
        .rearrangeCourse(localStorage.getItem("userID"), data)
        .subscribe(
          res => {
            this.isSubmitting = false;
            this.isError = false;
            this.isSuccess = true;
          },
          err => {
            this.isSubmitting = false;
            this.isSuccess = false;
            this.isError = true;
            event.target.disabled = false;
          }
        );
    }
  }

  /**
   * Prepare submition data.
   */
  prepareSubmitionData() {
    if (!this.confirmationData.arrangeFlag) {
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
        IsPayNow: this.isPayNow
      };
      return data;
    } else {
      const data: any = {};
      data.LearnerId = Number(this.learnerId);
      data.TeacherId = this.confirmationData.teacherId;
      data.RoomId = Number(this.getRoomIdValue());
      data.OrgId = this.confirmationData.orgId;
      data.BeginTime = this.formatDate(this.confirmationData.startStr);
      data.Reason = "reschedule";
      data.CourseInstanceId = this.confirmationData.courseInstanceId;
      return data;
    }
  }

  getRoomIdValue() {
    if (this.frequencyRoom.length !== 0) {
      return this.frequencyRoom[0]["RoomId"];
    } else {
      const obj = document.getElementById("ROOMS");
      return obj["value"];
    }
  }

  getPaymentIdValue() {
    let id: number;
    const obj = document.getElementsByClassName("PAYMENTS");
    for (let i = 0; i < obj.length; i++) {
      if (obj[i]["checked"]) {
        id = Number(obj[i]["id"]);
      }
    }
    return id;
  }

  getDurationIndex(startTimeStamp: number, endTimeStamp: number) {
    const timeDiffer: number = endTimeStamp - startTimeStamp;
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
    const courseId = Number(event.target.value);
    this.trialCourseId = courseId;
    this.avaliableCourses.map(val => {
      if (val["CourseId"] == courseId) {
        this.coursePrice = val["Price"] + this.extraFee;
      }
    });
  }

  /**
   * Close confirmation modal and emit to parents to refresh.
   */
  closeConfirmationModal() {
    this.activeModal.close("Close click");
    this.isClosed.emit(true);
    if (this.confirmationData.arrangeFlag) {
      this.router.navigateByUrl(
        "learner/credit/" + this.confirmationData.LearnerId
      );
    }
  }

  /**
   * Down load invoice.
   */
  downloadInvoice() {
    const learnerName: IInvoiceLearnerName = {
      firstName: this.learner.FirstName,
      lastName: this.learner.LastName,
      Email:this.learner.Email
    };
    const invoice: IInvoice = {
      LessonQuantity: 1,
      CourseName: this.confirmationData.cateName,
      BeginDate: new Date(
        this.confirmationData.startTimeStamp
      ).toLocaleDateString(),
      LessonFee: this.coursePrice,
      Other1Fee: this.extraFee,
      Other1FeeName: "Trial Course Extra",
      TotalFee: this.coursePrice + this.extraFee
    };

    let branch = this.learner.Org;
    this.downloadPDFService.downloadPDF(learnerName, invoice,branch )
  }
}

export interface IConfirmData {
  teacherId: number;
  teacherName: string;
  startTimeStamp: number;
  endTimeStamp: number;
  orgId: number;
  orgName: string;
  cateName: string;
  cateId: number;
  teacher: object;
  startStr: string;
  endStr: string;
  LearnerId: number;
  arrangeFlag: boolean;
  courseLevel: number;
  courseInstanceId: number;
}

export interface IData {
  LearnerId: number;
  RoomId: number;
  TeacherId: number;
  OrgId: number;
  BeginTime: any;
  EndTime: any;
  PaymentMethod: number;
  Amount: number;
  StaffId: number;
  TrialCourseId: number;
  IsPayNow: boolean;
}
