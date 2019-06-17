import { LearnersService } from 'src/app/services/http/learners.service';
import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
//declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { reduce } from 'rxjs/operators';
import { TrialConfirmComponent } from '../trial-confirm/trial-confirm.component';
import { CoursesService } from 'src/app/services/http/courses.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';



@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrialModalComponent implements OnInit {
  public timeslot: Array<any> = [
    { "start": "2019-06-12T09:00:00", "end": "2019-06-12T09:30:00", "rendering": 'background', },
    { "start": "2019-06-12T09:45:00", "end": "2019-06-12T10:30:00", "rendering": 'background', },
    { "start": "2019-06-12T11:30:00", "end": "2019-06-12T12:00:00", "rendering": 'background', },
    { "start": "2019-06-12T13:00:00", "end": "2019-06-12T14:00:00", "rendering": 'background', },
    { "start": "2019-06-12T15:00:00", "end": "2019-06-12T16:00:00", "rendering": 'background', },
    { "start": "2019-06-12T16:30:00", "end": "2019-06-12T17:00:00", "rendering": 'background', }
  ];
  public teachersLevel;
  //1800000 milliseconds in 30 min
  public timeInterval30Min: number = 1800000;
  public timeInterval45Min: number = 2700000;
  public timeInterval60Min: number = 3600000;
  //84600000 milliseconds in a day
  public timeStamp1Day: number = 86400000;
  public currentDay: string;
  public coursePrice: number;
  //public availableDOW: Array<number> = [2, 3, 4];
  public studentFullName: string;
  public studentLevel: number;
  public courseId: number;

  @Input() termPeriod: Array<any>;
  @Input() courses;
  @Input() orgName;
  @Input() orgId;
  @Input() cateName;
  @Input() cateId;
  @Input() whichTeacher;
  @Input() LearnerId;
  @Input() availableDOW;
  @Input() learners;
  @Input() coursesTeachingByWhichTeacher;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  options: OptionsInput;
  //eventsModel: any;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private coursesService: CoursesService,
    private learnerService: LearnersService,
    private lookupsService: LookUpsService) { }

  ngOnInit() {
    //assign current day as semester begain day.
    this.currentDay = this.transferTimestampToTime(new Date().getTime(), 1);
    this.initFullCalendar(this);
  }

  /*
    initiate settings of full calendar mode
  */
  initFullCalendar(pointer) {
    let that = pointer;
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      //starting time of a day
      minTime: '09:00',
      //end time of a day
      maxTime: '18:00',
      //each grid represents 15 min
      slotDuration: '00:15',
      events: this.getAvailableTime(),
      selectConstraint: this.getAvailableTime(),
      select: function (info) {
        that.selectCallBack(info);
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
    events handler when user select grids on calendar
  */
  selectCallBack(info) {
    let startTimestamp = Date.parse(info.startStr);
    let endTimestamp = Date.parse(info.endStr);
    if (endTimestamp - startTimestamp < this.timeInterval30Min) {
      alert('Sorry, course duration can not less than 30 min.')
    }
    else if (endTimestamp - startTimestamp > 2 * this.timeInterval30Min) {
      alert('Sorry, course duration can not more than 1 hour.')
    }
    else {
      let duration = this.durationFormatting(startTimestamp, endTimestamp);
      if (this.prepareCourse(duration) == true) {
        this.popUpConfirmModal(startTimestamp, endTimestamp);
      };
    }
  }

  prepareCourse(duration) {
    let studentLevel = this.getStudentLevel();
    //console.log(this.studentLevel)
    let array: Array<any> = [];
    for (let i of this.courses) {
      if (i.CourseType == 1 && this.whichTeacher.Level == i.TeacherLevel && i.CourseCategoryId == this.cateId
        && i.Duration == duration && i.Level == studentLevel) {
        array.push(i);
        this.coursePrice = i.Price;
        this.courseId = i.CourseId;
      }
    }
    if (array.length == 0) {
      alert('Sorry, we do not have such course, please select another one.')
      return false;
    }

    return true;
  }

  getStudentLevel() {
    for (let i of this.learners) {
      if (i.LearnerId == this.LearnerId) {
        this.studentFullName = i.FirstName + ' ' + i.LastName;
        return i.LearnerLevel
      }
    }
  }

  durationFormatting(start, end) {
    if (end - start == this.timeInterval30Min) {
      return 1;
    }
    else if (end - start == this.timeInterval45Min) {
      return 2;
    }
    else if (end - start == this.timeInterval60Min) {
      return 3;
    }
  }

  popUpConfirmModal(startTimestamp, endTimestamp) {
    const modalRef = this.modalService.open(TrialConfirmComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.startTime = this.transferTimestampToTime(startTimestamp);
    modalRef.componentInstance.endTime = this.transferTimestampToTime(endTimestamp);
    modalRef.componentInstance.orgName = this.orgName;
    modalRef.componentInstance.cateName = this.cateName;
    modalRef.componentInstance.whichTeacher = this.whichTeacher;
    modalRef.componentInstance.coursePrice = this.coursePrice;
    modalRef.componentInstance.studentFullName = this.studentFullName;
    modalRef.componentInstance.learnerId = this.LearnerId;
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.orgId = this.orgId;
    modalRef.componentInstance.closeModalFlag.subscribe(
      (res) => {
        let that = this;
        modalRef.result.then(
          function () {
            if (res == true) {
              that.activeModal.close('Cross click')
            }
          },
          function () {
            return;
          })
      }
    )
  }
  /*
    get teacher's available time.
      --> in order to pick a period of time to take the trial lesson.
  */
  getAvailableTime() {
    let array = [];
    array = this.checkAvailableDOW(array);
    array = this.checkAvailablePeriod(array);
    array.sort()

    let newObjArr = [];
    for (let i = 0; i < array.length; i += 2) {
      if (array[i + 1] - array[i] >= this.timeInterval30Min) {
        newObjArr.push({ "start": this.transferTimestampToTime(array[i]), "end": this.transferTimestampToTime(array[i + 1]), "rendering": 'background', })
      }
    }
    return newObjArr
  }

  /*
    get available day of week in semester period
      --> if available, push this day in an array,
          else, drop it.
  */
  checkAvailableDOW(array) {
    //  --> the days befor current day are unavailable.
    this.termPeriod[0].BeginDate = this.currentDay;
    //outer for-loop can support multiple semesters
    for (let j of this.termPeriod) {
      //check each day of a semester, if it is available, push it in an array, else drop it
      for (let i = Date.parse(j.BeginDate); i <= Date.parse(j.EndDate); i += this.timeStamp1Day) {
        let date = new Date(i);
        if (this.availableDOW.indexOf(date.getDay()) !== -1) {
          array.push(i); //start time
          array.push(i + this.timeStamp1Day); //end time
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
  checkAvailablePeriod(array) {
    let timeSlot = this.getTimeSlot()
    for (let i of timeSlot) {
      if (Date.parse(i.start) >= Date.parse(this.currentDay)) {
        array.push(Date.parse(i.start));
        array.push(Date.parse(i.end));
      }
    }
    return array;
  }

  /*
    transfer time stamp to the timeStr that fullcalendar can read.
  */
  transferTimestampToTime(timestamp, code?) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + 'T';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (code == 1) {
      return Y + M + D + '00:00:00';
    }
    else {
      return Y + M + D + h + m + s;
    }
  }

  /*
    get time that teacher are now having class
  */
  getTimeSlot() {
    let obj = [];
    for (let i of this.coursesTeachingByWhichTeacher) {
      console.log(i)
      obj.push({ "start": i.start, "end": i.end, "rendering": 'background', })
    }
    return obj;
  }

}
