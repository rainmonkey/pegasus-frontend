import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialConfirmComponent } from '../trial-confirm/trial-confirm.component';
import { SessionTimePickerService } from "src/app/services/others/session-time-picker.service"



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
  public studentFullName: string;
  public studentLevel: number;
  public courseId: number;
  //arrange
  public arrangeFlag: boolean = false

  @Input() termPeriod: Array<any>;
  @Input() courses: Array<any>;
  @Input() orgName: string;
  @Input() orgId: number;
  @Input() cateName: string;
  @Input() cateId: number;
  @Input() whichTeacher: any;
  @Input() LearnerId: any;
  @Input() availableDOW: Array<number>;
  @Input() learners: any;
  @Input() coursesTeachingByWhichTeacher: any;

  //arrange
  @Input() duration: any
  @Input() arrangeCourseInstance: any

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  options: OptionsInput;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private sessionTimePicker: SessionTimePickerService) { }

  ngOnInit() {
    if (this.duration) {
      this.arrangeFlag = true
    }
    //assign current day as semester begain day.
    this.currentDay = this.sessionTimePicker.transferTimestampToTime(new Date().getTime(), 1);
    this.prepareCalendar()
  }

  prepareCalendar() {
    this.sessionTimePicker.initFullCalendar(this);
    let newObjArr = this.getAvailableTime()
    this.options.events = newObjArr
    this.options.selectConstraint = newObjArr
  }

  /*
    get teacher's available time.
      --> in order to pick a period of time to take the trial lesson.
  */
  getAvailableTime() {
    let array = [];
    array = this.checkAvailableDOW(array, this.availableDOW);
    array = this.checkAvailablePeriod(array);
    array.sort()
    let newObjArr = [];
    for (let i = 0; i < array.length; i += 2) {
      if (array[i + 1] - array[i] >= this.timeInterval30Min) {
        newObjArr.push({ "start": this.sessionTimePicker.transferTimestampToTime(array[i]), "end": this.sessionTimePicker.transferTimestampToTime(array[i + 1]), "rendering": 'background' })
      }
    }
    return newObjArr
  }

  /*
    get available day of week in semester period
      --> if available, push this day in an array,
          else, drop it.
  */
  checkAvailableDOW(array, availableDOW) {
    for (let i in availableDOW) {
      if (availableDOW[i] == 7) {
        availableDOW[i] = 0;
      }
    }
    console.log(this.termPeriod)
    //  --> the days befor current day are unavailable.
    this.termPeriod[0].BeginDate = this.currentDay;
    //outer for-loop can support multiple semesters
    for (let j of this.termPeriod) {
      //check each day of a semester, if it is available, push it in an array, else drop it
      for (let i = Date.parse(j.BeginDate); i <= Date.parse(j.EndDate); i += this.timeStamp1Day) {
        let date = new Date(i);
        console.log(date.getDay())
        // if (availableDOW.indexOf(date.getDay()) !== -1) {
        //   array.push(i); //start time
        //   array.push(i + this.timeStamp1Day); //end time
        // }
        if (availableDOW.includes(date.getDay())) {
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
    get time that teacher are now having class
  */
  getTimeSlot() {
    let obj = [];
    for (let i of this.coursesTeachingByWhichTeacher) {
      obj.push({ "start": i.start, "end": i.end, "rendering": 'background', })
    }
    return obj;
  }


  /*
    events handler when user select grids on calendar
  */
  selectCallBack(info) {
    let startTimestamp = Date.parse(info.startStr);
    let endTimestamp = Date.parse(info.endStr);
    console.log(info)
    //arrange
    if (this.arrangeFlag) {
      if (endTimestamp - startTimestamp >= this.timeInterval30Min) {
        alert('Please select a start time')
      } else {
        this.prepareCourse(this.duration)
        endTimestamp = this.transferEndTime(startTimestamp, this.duration)
        this.popUpConfirmModal(startTimestamp, endTimestamp);
      }
    } else {
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
  }

  prepareCourse(duration) {
    let studentLevel = this.getStudentLevel();
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

  transferEndTime(startTimestamp, duration) {
    let endTimestamp = startTimestamp
    if (duration == 1) {
      endTimestamp += this.timeInterval30Min
    } else if (duration == 2) {
      endTimestamp += this.timeInterval45Min
    } else if (duration == 3) {
      endTimestamp += this.timeInterval60Min
    }
    return endTimestamp
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
    modalRef.componentInstance.startTime = this.sessionTimePicker.transferTimestampToTime(startTimestamp);
    modalRef.componentInstance.endTime = this.sessionTimePicker.transferTimestampToTime(endTimestamp);
    modalRef.componentInstance.orgName = this.orgName;
    modalRef.componentInstance.cateName = this.cateName;
    modalRef.componentInstance.whichTeacher = this.whichTeacher;
    modalRef.componentInstance.coursePrice = this.coursePrice;
    modalRef.componentInstance.studentFullName = this.studentFullName;
    modalRef.componentInstance.learnerId = this.LearnerId;
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.orgId = this.orgId;
    modalRef.componentInstance.arrangeFlag = this.arrangeFlag;
    if (this.arrangeFlag) {
      modalRef.componentInstance.arrangeCourseInstance = this.arrangeCourseInstance
    }
    modalRef.componentInstance.closeModalFlag.subscribe(
      (res) => {
        let that = this;
        modalRef.result.then(
          function() {
            if (res == true) {
              that.activeModal.close('Cross click')
            }
          },
          function() {
            return;
          })
      }
    )
  }
}
