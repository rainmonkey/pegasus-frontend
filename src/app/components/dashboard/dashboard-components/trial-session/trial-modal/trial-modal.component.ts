import { Component, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialConfirmComponent } from '../trial-confirm/trial-confirm.component';
import { CoursesService } from 'src/app/services/http/courses.service';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { LearnersService } from 'src/app/services/http/learners.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrialModalComponent implements OnInit {
  public timeslot: Array<any> = [
    { start: '2019-06-12T09:00:00', end: '2019-06-12T09:30:00', rendering: 'background', },
    { start: '2019-06-12T09:45:00', end: '2019-06-12T10:30:00', rendering: 'background', },
    { start: '2019-06-12T11:30:00', end: '2019-06-12T12:00:00', rendering: 'background', },
    { start: '2019-06-12T13:00:00', end: '2019-06-12T14:00:00', rendering: 'background', },
    { start: '2019-06-12T15:00:00', end: '2019-06-12T16:00:00', rendering: 'background', },
    { start: '2019-06-12T16:30:00', end: '2019-06-12T17:00:00', rendering: 'background', }
  ];
  public teachersLevel;
  // 1800000 milliseconds in 30 min
  public timeInterval30Min = 1800000;
  public timeInterval45Min = 2700000;
  public timeInterval60Min = 3600000;
  // 84600000 milliseconds in a day
  public timeStamp1Day = 86400000;
  public currentDay: string;
  public coursePrice: number;
  public studentFullName: string;
  public courseId: number;
  public availableDOW;
  public learnerDetails;
  public LearnerLevel: number;
  public course;
  public learner;
  public teachers;
  public teachingCourses;
  public timeSlots;
  // arrange
  public isDraggableFlag = true;

  @Input() termPeriod: Array<any>; // this.coursesService.getoioi()  => term.BeginDate
  @Input() courses;  // this.coursesService.getCourses()  => courseId, coursePrice
  @Input() orgName: string;  // ok
  @Input() orgId: number;   // ok
  @Input() cateName: string; // ok
  @Input() cateId: number;  // ok
  @Input() teacherDetails;  //
  @Input() LearnerId: number;  // ok
  @Input() TeacherId: number;
  @Input() coursesTeachingByWhichTeacher;  // this.coursesService.getLessonsByTeacherId(teacherId)
  // => start end
  // arrange
  @Input() durationId;
  @Input() arrangeCourseInstance;

  @Input() notDraggable;
  @Input() duration

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  options: OptionsInput;

  @Output() userSelectedTime: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private coursesService: CoursesService,
    private teachersService: TeachersService,
    private learnersService: LearnersService) { }

  ngOnInit() {
    this.currentDay = this.transferTimestampToTime(new Date().getTime(), 1);
    if (this.notDraggable || this.durationId) {
      this.isDraggableFlag = false;
    }
    this.prepareData();
    // assign current day as semester begain day.
  }

  prepareData() {
    // timeslot有问题
    const array: Array<any> = [];

    array.push(this.learnersService.getLearnerById(this.LearnerId));
    if (!this.termPeriod) {
      array.push(this.coursesService.getoioi());
    }
    if (!this.courses) {
      array.push(this.coursesService.getCourses());
    }
    if (!this.teacherDetails) {
      array.push(this.teachersService.getTeachersInfo());
    }
    if (!this.coursesTeachingByWhichTeacher) {
      array.push(this.coursesService.getLessonsByTeacherId(this.TeacherId));
    }

    forkJoin(array).subscribe(res => {
      this.learner = res[0].Data;
      let index = 1;
      if (!this.termPeriod) {
        this.termPeriod = res[index].Data;
        index++;
      }
      if (!this.courses) {
        this.courses = res[index].Data;
        index++;
      }
      if (!this.teacherDetails) {
        const teacherList = res[index].Data;
        this.teacherDetails = teacherList.find(teacher => teacher.TeacherId === this.TeacherId);
        index++;
      }
      if (!this.coursesTeachingByWhichTeacher) {
        this.coursesTeachingByWhichTeacher = res[index].Data;
        index++;
      }

      this.studentFullName = this.learner.FirstName + ' ' + this.learner.LastName;
      this.LearnerLevel = this.learner.LearnerLevel;
      this.availableDOW = this.getAvailabelDOW(this.teacherDetails);
      this.timeSlots = this.getAvailableTimeSlots();
      this.initFullCalendar(this);
    });
  }

  /*
    initiate settings of full calendar mode
  */
  initFullCalendar(pointer) {
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      // end time of a day
      maxTime: '20:00',
      // each grid represents 15 min
      slotDuration: '00:15',
      events: this.timeSlots,
      selectConstraint: this.timeSlots,
      select(info) {
        pointer.selectCallBack(info);
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    };
  }

  /*
    transfer time stamp to the timeStr that fullcalendar can read.
  */
  transferTimestampToTime(timestamp, code?) {
    const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + 'T';
    const h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (code === 1) {
      return Y + M + D + '00:00:00';
    } else {
      return Y + M + D + h + m + s;
    }
  }

  /*
    get teacher's available time.
      --> in order to pick a period of time to take the trial lesson.
  */
  getAvailableTimeSlots() {
    let array = [];
    array = this.getAvailableTime(array, this.termPeriod);
    array = this.addOccupiedTime(array);
    array = Array.from(new Set(array.sort()))
    const newObjArr = [];
    for (let i = 0; i < array.length; i += 2) {
      if (array[i + 1] - array[i] >= this.timeInterval30Min) {
        newObjArr.push({ start: this.transferTimestampToTime(array[i]), end: this.transferTimestampToTime(array[i + 1]), rendering: 'background' });
      }
    }
    return newObjArr;
  }

  /*
    get teacher availabe day in a week
  */
  getAvailabelDOW(teacherDetails) {
    const array: Array<any> = [];
    for (const i of teacherDetails.AvailableDays) {
      if (i.OrgId === this.orgId) {
        array.push(i.DayOfWeek);
      }
    }
    return array;
  }

  /*
    get available day of week in semester period
      --> if available, push this day in an array,
          else, drop it.
  */
  getAvailableTime(array, termPeriod?) {
    for (const i in this.availableDOW) {
      if (this.availableDOW[i] === 7) {
        this.availableDOW[i] = 0;
      }
    }
    //  --> the days befor current day are unavailable.
    if (Date.parse(termPeriod[0].EndDate) < Date.parse(this.currentDay)) {
      termPeriod = termPeriod.slice(1);
    }
    termPeriod[0].BeginDate = this.currentDay;
    // outer for-loop can support multiple semesters
    for (const j of termPeriod) {
      // check each day of a semester, if it is available, push it in an array, else drop it
      for (let i = Date.parse(j.BeginDate); i <= Date.parse(j.EndDate); i += this.timeStamp1Day) {
        const date = new Date(i);
        if (this.availableDOW.indexOf(date.getDay()) !== -1) {
          array.push(i); // start time
          array.push(i + this.timeStamp1Day); // end time
        }
      }
    }
    return array;
  }

  /*
    get available period of time in a day
      --> if a period of time is already taken(on lessons time), drop it from available time array,
          else push it to available time array.
  */
  addOccupiedTime(array) {
    const occupiedTimeSlots = this.getTimeSlot();
    for (const i of occupiedTimeSlots) {
      if (Date.parse(i.start) >= Date.parse(this.currentDay)) {
        array.push(Date.parse(i.start));
        array.push(Date.parse(i.end));
      }
    }
    return array;
  }

  /*
    events handler when user select grids on calendar
  */
  selectCallBack(info) {
    const startTimestamp = Date.parse(info.startStr);
    let endTimestamp = Date.parse(info.endStr);
    // arrange
    if (!this.isDraggableFlag) {
      if (endTimestamp - startTimestamp >= this.timeInterval30Min) {
        alert('Please select a start time');
      } else {
        if (false) {

        } else {
          if (this.durationId) {
            this.prepareCourse(this.durationId);
            endTimestamp = this.transferEndTime(startTimestamp, this.durationId);
            this.popUpConfirmModal(startTimestamp, endTimestamp);
          } else {
            const durationId = this.durationFormatting(0, this.duration);
            console.log(durationId)
            if (this.prepareCourse(durationId)) {
              this.userSelectedTime.emit(this.transferTimestampToTime(startTimestamp));
              this.activeModal.close()
            }
          }
        }

      }
    } else {
      if (endTimestamp - startTimestamp < this.timeInterval30Min) {
        alert('Sorry, course durationId can not less than 30 min.');
      } else if (endTimestamp - startTimestamp > 2 * this.timeInterval30Min) {
        alert('Sorry, course durationId can not more than 1 hour.');
      } else {
        const durationId = this.durationFormatting(startTimestamp, endTimestamp);
        if (this.prepareCourse(durationId)) {
          this.popUpConfirmModal(startTimestamp, endTimestamp);
        }
      }
    }
  }

  prepareCourse(durationId) {
    let count = 0
    for (const i of this.courses) {
      console.log(count)
      if (i.CourseType === 1 && this.teacherDetails.Level === i.TeacherLevel && i.Duration === durationId && i.Level === this.LearnerLevel && (!this.cateId || i.CourseCategoryId === this.cateId)) {
        count++
        this.course = i;
        this.coursePrice = i.Price;
        this.courseId = i.CourseId;
      }
    }
    if (!this.course) {
      alert('Sorry, we do not have such course, please select another one.');
      return false;
    }
    return true;
  }

  transferEndTime(startTimestamp, durationId) {
    let endTimestamp = startTimestamp;
    if (durationId === 1) {
      endTimestamp += this.timeInterval30Min;
    } else if (durationId === 2) {
      endTimestamp += this.timeInterval45Min;
    } else if (durationId === 3) {
      endTimestamp += this.timeInterval60Min;
    }
    return endTimestamp;
  }

  durationFormatting(start, end) {
    if (end - start === this.timeInterval30Min) {
      return 1;
    } else if (end - start === this.timeInterval45Min) {
      return 2;
    } else if (end - start === this.timeInterval60Min) {
      return 3;
    }
  }

  popUpConfirmModal(startTimestamp, endTimestamp) {
    const modalRef = this.modalService.open(TrialConfirmComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.startTime = this.transferTimestampToTime(startTimestamp);
    modalRef.componentInstance.endTime = this.transferTimestampToTime(endTimestamp);
    modalRef.componentInstance.orgName = this.orgName;
    modalRef.componentInstance.cateName = this.cateName;
    modalRef.componentInstance.teacherDetails = this.teacherDetails;
    modalRef.componentInstance.coursePrice = this.coursePrice;
    modalRef.componentInstance.studentFullName = this.studentFullName;
    modalRef.componentInstance.learnerId = this.LearnerId;
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.orgId = this.orgId;
    modalRef.componentInstance.isDraggableFlag = this.isDraggableFlag;
    if (!this.isDraggableFlag) {
      modalRef.componentInstance.arrangeCourseInstance = this.arrangeCourseInstance;
    }
    modalRef.componentInstance.closeModalFlag.subscribe(
      (res) => {
        const that = this;
        modalRef.result.then(
          () => {
            if (res) {
              that.activeModal.close('Cross click');
            }
          },
          () => {
            return;
          });
      }
    );
  }

  /*
    get time that teacher are now having class
  */
  getTimeSlot() {
    const obj = [];
    for (const i of this.coursesTeachingByWhichTeacher) {
      obj.push({ start: i.start, end: i.end, rendering: 'background' });
    }
    return obj;
  }

}
