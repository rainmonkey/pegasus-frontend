import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { OptionsInput } from "@fullcalendar/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TrialCoursesService } from "src/app/services/http/trial-courses.service";
import { TeachersService } from "src/app/services/http/teachers.service";
import { TrialConfirmationComponent } from "./../trial-confirmation/trial-confirmation.component";
import { forkJoin, Observable } from "rxjs";

@Component({
  selector: "app-trial-calendar",
  templateUrl: "./trial-calendar.component.html",
  styleUrls: ["./trial-calendar.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class TrialCalendarComponent implements OnInit {
  public options: OptionsInput;
  public timeSlots: any;
  @Input() teacher: object;
  @Input() orgName: string;
  @Input() orgId: number;
  @Input() courseCategoryName: string;
  @Input() CourseCategoryId: number;

  selectMode = false;
  @Input() teacherId: number;
  @Input() duration: number;
  @Output() userSelectedTime = new EventEmitter();
  @Input() durationType: number;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private trialService: TrialCoursesService,
    private teacherService: TeachersService
  ) {}

  ngOnInit() {
    if (this.duration || this.durationType) {
      this.selectMode = true;
    }
    if (this.durationType) {
      if (this.durationType === 1) {
        this.duration = 180000;
      } else if (this.durationType === 2) {
        this.duration = 270000;
      } else if (this.durationType === 3) {
        this.duration = 360000;
      }
    }
    console.log(this.duration, this.durationType);
    this.getDataFromServer().subscribe(res => {
      if (this.selectMode) {
        this.teacher = res[2]["Data"];
      }
      const coursesSlots = res[0]["Data"].map(val => {
        val.title = val.roomName;
        return val;
      });
      this.timeSlots = this.calculateAvaliableTimeSlots(res[1]["Data"]);
      this.initializeFullCalendar(coursesSlots, this.timeSlots);
    });
  }

  /**
   * Get datas from server with several apis.
   * @returns {Observable} observable of data (coursesOfATeacher, terms of a year)
   */
  getDataFromServer(): Observable<Array<object>> {
    const apiRequests: Array<any> = [];
    if (this.selectMode) {
      apiRequests.push(
        this.trialService.getTeacherCoursesbyId(
          this.teacherId || this.teacher["TeacherId"]
        )
      );
      apiRequests.push(this.trialService.getTermsDuration());
      apiRequests.push(
        this.teacherService.getTeacherInfo(
          this.teacherId || this.teacher["TeacherId"]
        )
      );
    } else {
      apiRequests.push(
        this.trialService.getTeacherCoursesbyId(this.teacher["TeacherId"])
      );
      apiRequests.push(this.trialService.getTermsDuration());
    }
    return forkJoin(apiRequests);
  }

  /**
   * Calculate avaliable time slots that user can select on calendar.
   * 1, Get teacher's avaliable days of one week.
   * 2, Get term avaliable time durations (current and incoming terms).
   * 3, For each day of avaliable term duration, if teacher is avaliable in this day, push it into an array, else, abandon it.
   * 4, Finally, return the espected result;
   * @param terms - terms of a year
   * @returns {Array<object>} list of avaliable time slots after calculation
   */
  calculateAvaliableTimeSlots(terms: Array<object>) {
    /**@property {Array<number>} dayOfWeek - teacher's avaliable day of one week */
    const dayOfWeek: Array<number> = this.getDayOfWeek(this.teacher);
    /**@property {Array<object>} avaliableTermDuration - avaliable term duration*/
    const avaliableTermDuration: Array<object> = this.getAvaliableTermDuration(
      terms
    );
    /**@property {Array<object>} avaliableTimeSlots - a list saved avaliable time slots and returned at the end of function */
    const avaliableTimeSlots: Array<object> = [];
    const millisecOfOneDay: number = 86400000;

    /**To estimate whether a day is avaliable*/
    avaliableTermDuration.map(val => {
      const endDateTimeStamp = new Date(val["EndDate"]).getTime();
      //start date is from current day(days before current day are all unavaliable)
      const startDateTimeStamp = new Date().getTime();
      //iterator of term's duration times
      for (
        let i = startDateTimeStamp;
        i < endDateTimeStamp;
        i += millisecOfOneDay
      ) {
        const date = new Date(i);

        const weekDay = date.getDay() == 0 ? 7 : date.getDay();
        const year = date.getFullYear();
        const month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        if (dayOfWeek.includes(weekDay)) {
          avaliableTimeSlots.push({
            start: `${year}-${month}-${day}T00:00:00`,
            end: `${year}-${month}-${day}T23:59:59`,
            rendering: "background"
          });
        }
      }
    });
    return avaliableTimeSlots;
  }

  /**
   * Get teacher avaliable days of one week.
   * @param teacher - teacher's object
   * @returns {Array<number>} array of avaliable days of one week
   */
  getDayOfWeek(teacher: object) {
    const array: Array<number> = [];
    teacher["AvailableDays"].map(val => {
      array.push(val.DayOfWeek);
    });
    return array;
  }

  /**
   * Get avaliable term durations(current and incoming terms)
   * @param terms - all terms in a year
   */
  getAvaliableTermDuration(terms) {
    /**@property {number} timeStampOfToday - stamp of today */
    const timeStampOfToday: number = new Date().getTime();
    const avaliableTermDuration: Array<object> = terms.filter(val => {
      /**@property {number} - end date time stamp of each term*/
      const timeStamp: number = new Date(val["EndDate"]).getTime();
      if (timeStamp > timeStampOfToday) {
        return val;
      }
    });
    return avaliableTermDuration;
  }

  /**
   * Full calendar's configuration.
   * @param coursesTimeSlots - time slots of existed sessions.
   * @param avaliableDaySlots - time slots of teacher's avaliable days in one or more terms.
   */
  initializeFullCalendar(
    coursesTimeSlots: Array<object>,
    avaliableDaySlots: Array<any>
  ) {
    const that = this;
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: this.selectMode ? false : true,
      minTime: "09:00",
      maxTime: "20:00",
      slotDuration: "00:15",
      eventSources: [coursesTimeSlots, avaliableDaySlots],
      eventBackgroundColor: "lightblue",
      selectMirror: true,
      selectOverlap(event) {
        return event.rendering === "background";
      },
      selectConstraint: avaliableDaySlots,
      select(info) {
        that.selectSlot(info);
      },
      header: {
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek"
      },
      dateClick: info => {
        const occupiedStartTimestamps = coursesTimeSlots.map(
          el => +new Date(el["start"])
        );
        let diff;
        for (let i = 0; i < occupiedStartTimestamps.length; i++) {
          diff = occupiedStartTimestamps[i] - +info.date;
          if (diff < 3600000 && diff > 0 && diff < this.duration) {
            break;
          }
          diff = 0;
        }
        if (diff) {
          alert(
            `Your selected time is ${info.dateStr
              .split("+")[0]
              .replace("T", " ")} to ${new Date(
              +info.date +
                this.duration -
                new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .replace("T", " ")
              .slice(
                0,
                length - 5
              )}, which has been occupied by other course, please select another time.`
          );
        } else {
          this.userSelectedTime.emit(info.dateStr.split("+")[0]);
          this.activeModal.close();
        }
      },
      plugins: [timeGridPlugin, interactionPlugin]
    };
  }

  /**
   * Call back function of full calendar select.
   * If selected time slots >= 30 min and <= 60 min, popup confirmation modal.
   * @param info - infomation of select event
   */
  selectSlot(info) {
    const milliSecIn30Min = 1800000;
    const milliSecIn60Min = 3600000;
    const startStr = info.startStr;
    const startTimeStamp = new Date(startStr).getTime();
    const endStr = info.endStr;
    const endTimeStamp = new Date(endStr).getTime();
    const differTimeStamp = endTimeStamp - startTimeStamp;

    if (
      differTimeStamp >= milliSecIn30Min &&
      differTimeStamp <= milliSecIn60Min
    ) {
      this.popUpConfirmationModal(
        startTimeStamp,
        endTimeStamp,
        startStr,
        endStr
      );
    }
  }

  /**
   * Pop up confirm modal.
   * @param courseStartTime - start time stamp
   * @param courseEndTime - end time stamp
   * @param startStr - start time string
   * @param endStr - end time string
   */
  popUpConfirmationModal(
    courseStartTime: number,
    courseEndTime: number,
    startStr: string,
    endStr: string
  ) {
    const modalRef = this.modalService.open(TrialConfirmationComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.confirmationData = {
      teacherId: this.teacher["TeacherId"],
      teacherName: this.teacher["FirstName"] + "  " + this.teacher["LastName"],
      startTimeStamp: courseStartTime,
      endTimeStamp: courseEndTime,
      orgId: this.orgId,
      orgName: this.orgName,
      cateName: this.courseCategoryName,
      cateId: this.CourseCategoryId,
      teacher: this.teacher,
      startStr,
      endStr
    };
    modalRef.componentInstance.isClosed.subscribe(res => {
      this.activeModal.close("Close click");
    });
  }
}

//  * @param data - data to process
//  * @param selectionIndex - index of which teacher selected
//  */
// processTeachersList(data: Array<object>, selectionIndex: any) {
//   /**@property {Array<object>} array1 - array after processing (teachers list that pass org filter)*/
//   const array1: Array<object> = [];
//   // data[0] - teachers list
//   data[0]["Data"].map(val => {
//     val["AvailableDays"].map(item => {
//       if (item.OrgId == this.orgIdFilter) {
//         if (array1.indexOf(val) == -1) {
//           array1.push(val);
//         }
//       }
//     });
//   });
//   /**@property {Array<object>} array2 - array after processing (teachers list that pass cate and org filter) */
//   let array2: Array<object> = [];
//   array1.map(val => {
//     // data[1] - courses teaching list
//     for (const i of data[1]["Data"]) {
//       if (
//         i.Course.CourseCategory.CourseCategoryId == this.cateIdFilter &&
//         val["TeacherId"] == i.TeacherId
//       ) {
//         if (array2.indexOf(val) == -1) {
//           array2.push(val);
//         }
//       }
//     }
//   });
//   array2 = array2.filter(
//     el => el["Level"] === this.arrangeCourseDetails.Course.TeacherLevel
//   );
//   this.checkTeacherAvailableDays(array2, selectionIndex);
