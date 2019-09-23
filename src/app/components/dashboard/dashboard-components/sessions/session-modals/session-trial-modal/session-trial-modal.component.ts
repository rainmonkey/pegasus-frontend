import { style } from "@angular/animations";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CoursesService } from "src/app/services/http/courses.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TrialCoursesService } from "src/app/services/http/trial-courses.service";
import { forkJoin } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import {
  DownloadPDFService,
  IInvoiceLearnerName,
  IInvoice
} from "src/app/services/others/download-pdf.service";

@Component({
  selector: "app-session-trial-modal",
  templateUrl: "./session-trial-modal.component.html",
  styleUrls: [
    "../../../../../../shared/css/bootstrap-default-clear.css",
    "./session-trial-modal.component.css"
  ]
})
export class SessionTrialModalComponent implements OnInit {
  @Input() confirmationData: IConfirmData;
  @Output() isClosed = new EventEmitter();

  private learner:Ilearner ={firstName:'',lastName:'',contactNum:'',Email:''};
  private courseName: string;
  private startTimeStr: string;
  private endTimeStr: string;
  // private learnerName: string;
  // private avaliableRoom;
  private extraFee: number;
  // private frequencyRoom: Array<any> = [];
  private coursePrice: number;
  private trialCourseId: number;
  private avaliableCourses: Array<object>;

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
  private teachers:any ;
  private teacherId: number ;
  constructor(
    private routerInfo: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private trialService: TrialCoursesService,
    private downloadPDFService: DownloadPDFService,
    private courseService: CoursesService,
    private router: Router
  ) {}

  ngOnInit() {
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

    // get teacher request
    apiRequests.push(this.trialService.getTeacherbyRoomId(this.confirmationData.orgId,
            this.confirmationData.roomId,this.confirmationData.startStr));
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
    const { startTimeStamp, endTimeStamp } = this.confirmationData;
    // data from server

    this.teachers = dataFromServer[0]["Data"];
    const courses = dataFromServer[1]["Data"];
    this.extraFee = Number(dataFromServer[2]["Data"][0]["PropName"]);
 
    this.startTimeStr =
      new Date(startTimeStamp).toLocaleTimeString() +
      " " +
      new Date(startTimeStamp).toLocaleDateString();
    this.endTimeStr =
      new Date(endTimeStamp).toLocaleTimeString() +
      " " +
      new Date(endTimeStamp).toLocaleDateString();
    this.courseName = "Trial  Course";

    this.avaliableCourses = this.getAvaliableCourses(courses);
    this.coursePrice = this.avaliableCourses[0]["Price"] + this.extraFee;
    this.trialCourseId = this.avaliableCourses[0]["CourseId"];
    this.teacherId = this.teachers[0]['TeacherId'];
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
        val["Duration"] == durationIndex && val['CourseType']==1
      ) {
        array.push(val);
      }
    });

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
  // /**
  //  * When user click confirm button, prepare to submit data.
  //  */
  checkInput(){
    if (!(this.learner.firstName)||(this.learner.firstName=='')) return false;
    if (!(this.learner.lastName)||(this.learner.lastName=='')) return false;
    if (!(this.learner.contactNum)||(this.learner.contactNum=='')) return false;
    //if ((this.isPayNow)&&(this.getPaymentIdValue()==0)) return false;
    return true;
  }
  onSubmit(event) {
    if (!this.checkInput()){
      Swal.fire({title: 'Please check your input!',type: 'warning', showConfirmButton: true});
      return;
    }
    event.target.disabled = true;
    this.isSubmitting = true;
    const data = this.prepareSubmitionData();
         this.courseService
        .registAndTrial(data)
        .subscribe(
          res => {
            this.isSubmitting = false;
            this.isError = false;
            this.isSuccess = true;
          },
          err => {
            this.isSubmitting = false;
            this.isSuccess = false;
           // this.isError = true;
            event.target.disabled = false;
            let msg =err.error?err.error.ErrorMessage:"Something error ,Please try again!"
            Swal.fire({title:msg,type: 'error', showConfirmButton: true});
          }
        );
    
  }

  // /**
  //  * Prepare submition data.
  //  */
  prepareSubmitionData() {
    let data: IData;
    data = {
      // LearnerId: Number(this.learnerId),
      FirstName:this.learner.firstName,
      LastName:this.learner.lastName,
      ContactNum:this.learner.contactNum,
      RoomId: Number(this.confirmationData.roomId),
      TeacherId: this.teacherId,
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
  }

  getPaymentIdValue() {
    let id: number=0;
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
  selectTeacher(event) {
    this.teacherId = Number(event.target.value);
  }
  /**
   * Close confirmation modal and emit to parents to refresh.
   */
  closeConfirmationModal() {
    this.activeModal.close("Close click");
    this.isClosed.emit(true);
  }

  /**
   * Down load invoice.
   */
  downloadInvoice() {
    const learnerName: IInvoiceLearnerName = {
      firstName: this.learner.firstName,
      lastName: this.learner.lastName,
      Email:this.learner.Email
    };
    const invoice: IInvoice = {
      LessonQuantity: 1,
      CourseName: "course",
      BeginDate: new Date(
        this.confirmationData.startTimeStamp
      ).toLocaleDateString(),
      LessonFee: this.coursePrice,
      Other1Fee: this.extraFee,
      Other1FeeName: "Trial Course Extra",
      TotalFee: this.coursePrice + this.extraFee
    };

    // let branch = {};
    // this.downloadPDFService.downloadPDF(learnerName, invoice,branch )
  }
}

// startTimeStamp: info.startStr,
// endTimeStamp: info.endStr,
// orgId: JSON.parse(localStorage.getitem('OrgId'))[0],
// roomId:info.resource._resource.id,
// roomName:info.resource._resource.title

export interface IConfirmData {
  startTimeStamp: number;
  endTimeStamp: number;
  orgId: number;
  orgName: string;
  roomName: string;
  roomId: number;
  startStr: string;
  endStr: string;
}
export interface Ilearner {
  firstName: string;
  lastName: string;
  contactNum:string;
  Email:string;
}

export interface IData {
  FirstName:string;
  LastName:string;
  ContactNum:string;
  TeacherId: number;
  RoomId: number;
  OrgId: number;
  BeginTime: any;
  EndTime: any;
  PaymentMethod: number;
  Amount: number;
  StaffId: number;
  TrialCourseId: number;
  IsPayNow: boolean;
}
