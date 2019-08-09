import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialCoursesService } from 'src/app/services/http/trial-courses.service';
import { forkJoin, Observable } from 'rxjs';
import { start } from 'repl';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trial-confirmation',
  templateUrl: './trial-confirmation.component.html',
  styleUrls: ['../../../../../shared/css/bootstrap-default-clear.css',
    './trial-confirmation.component.css']
})
export class TrialConfirmationComponent implements OnInit {
  private courseName: string;
  private startTimeStr: string;
  private endTimeStr: string;
  private learnerName: string;
  private avaliableRoom;
  private extraFee: number;
  //private frequencyRoom: Array<any> = [];
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

  @Input() confirmationData: IConfirmData;

  constructor(
    private routerInfo: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private trialService: TrialCoursesService
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
   * @returns {Observable} array of data (avaliableRoom, frequentlyRoom, learner)
   */
  getDataFromServer() {
    let apiRequests: Array<any> = [];
    apiRequests.push(this.trialService.getAvailableRoom(
      this.confirmationData.orgId,
      new Date(this.confirmationData.startTimeStamp).toDateString(),
      new Date(this.confirmationData.endTimeStamp).toDateString()
    ));
    apiRequests.push(this.trialService.getTeacherFrequentlyRoom(
      this.confirmationData.teacherId,
      this.confirmationData.orgId,
      new Date(this.confirmationData.startTimeStamp).toDateString()
    ));
    apiRequests.push(this.trialService.getLearnerById(this.learnerId));
    apiRequests.push(this.trialService.getCourses());
    apiRequests.push(this.trialService.getExtraFee());

    return forkJoin(apiRequests);
  }

  /**
   * Process data to display.
   */
  processData(dataFromServer) {
    let courses = dataFromServer[3]['Data'];
    //data from parents
    let { startTimeStamp, endTimeStamp, cateName } = this.confirmationData;
    //data from server
    let avaliableRoom = dataFromServer[0]['Data'];
    let frequencyRoom = dataFromServer[1]['Data'];
    let learner = dataFromServer[2]['Data'];
    this.extraFee = Number(dataFromServer[4]['Data'][0]['PropName']);
    this.learnerName = learner['FirstName'] + '  ' + learner['LastName'];
    this.startTimeStr = new Date(startTimeStamp).toLocaleTimeString() + ' ' + new Date(startTimeStamp).toLocaleDateString();
    this.endTimeStr = new Date(endTimeStamp).toLocaleTimeString() + ' ' + new Date(endTimeStamp).toLocaleDateString();
    this.courseName = cateName + '  ' + 'Trial  Course';
    this.avaliableRoom = avaliableRoom;

    console.log(avaliableRoom)
    // frequencyRoom.map(
    //   (val) => {
    //     this.frequencyRoom.push({ roomId: val['RoomId'], roomName: val['RoomName'] });
    //   }
    // )
    //console.log(extraFee)
    this.avaliableCourses = this.getAvaliableCourses(courses);
    this.coursePrice = this.avaliableCourses[0]['Price'] + this.extraFee;
    this.trialCourseId = this.avaliableCourses[0]['CourseId'];
    console.log(this.avaliableCourses)

  }

  /**
   * Calculate the avaliable courses.
   * @param courses - courses object
   * @param learner - learner object
   */
  getAvaliableCourses(courses: Array<object>) {
    let array: Array<object> = [];
    courses.map(
      (val) => {
        if (val['CourseCategory']['CourseCategoryId'] == this.confirmationData.cateId &&
          val['Duration'] == this.confirmationData.durationIndex) {
          array.push(val);
        }
      })

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
   * Display payment methods options.
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
        console.log('yes')
      },
      (err) => {
        console.log(err)
      }
    )
  }

  prepareSubmitionData() {
    console.log(this.confirmationData.startStr)
    console.log(this.confirmationData.endStr)
    let data: IData;
    data = {
      LearnerId: Number(this.learnerId),
      RoomId: Number(this.getRoomIdValue()),
      TeacherId: this.confirmationData.teacherId,
      OrgId: this.confirmationData.orgId,
      BeginTime:this.timeFormatting(this.confirmationData.startStr),
      // new Date(this.confirmationData.startTimeStamp).toTimeString(),
      EndTime: this.timeFormatting(this.confirmationData.endStr),
      //new Date(this.confirmationData.endTimeStamp).toTimeString(),
      PaymentMethod: this.getPaymentIdValue(),
      Amount: this.coursePrice,
      StaffId: Number(localStorage.userID),
      TrialCourseId: this.trialCourseId,
      IsPayNow: true
    }
    console.log(data)
    return data;
  }

  timeFormatting(time) {
    return time.replace('T', '  ');
  }

  getRoomIdValue() {
    // if (this.frequencyRoom.length !== 0) {
    //   console.log(this.frequencyRoom[0]['roomId'])
    //   return this.frequencyRoom[0]['roomId']
    // }
    // else {
      let obj = document.getElementById('ROOMS');
      return obj['value'];
    //}
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

  selectCourse(event) {
    console.log(event)
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
  durationIndex: number,
  startStr:string,
  endStr:string
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
