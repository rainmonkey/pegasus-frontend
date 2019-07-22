import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialConfirmComponent } from '../trial-confirm/trial-confirm.component';
import { CoursesService } from 'src/app/services/http/courses.service';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { LearnersService } from 'src/app/services/http/learners.service';

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
  public courseId: number;
  public availableDOW;
  public learnerDetails;
  public LearnerLevel: number;
  //arrange
  public arrangeFlag: boolean = false

  @Input() termPeriod: Array<any>; //this.coursesService.getoioi()  => term.BeginDate
  @Input() courses;  //this.coursesService.getCourses()  => courseId, coursePrice
  @Input() orgName;  // ok 不需要
  @Input() orgId;   // ok
  @Input() cateName; // ok 不需要
  @Input() cateId;  // ok
  @Input() teacherDetails;  //
  @Input() LearnerId;  // ok
  @Input() learners; // this.learnersService.getLearnerList()  => studentFullName LearnerLevel
  @Input() coursesTeachingByWhichTeacher;  //this.coursesService.getLessonsByTeacherId(teacherId)
  // => start end
  //arrange
  @Input() duration
  @Input() arrangeCourseInstance

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  options: OptionsInput;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private coursesService: CoursesService,
    private teachersService: TeachersService,
    private learnersService: LearnersService) { }

  ngOnInit() {
    this.prepareData()
    if (this.duration) {
      this.arrangeFlag = true
    }
    console.log(this.teacherDetails)
    this.availableDOW = this.getAvailabelDOW(this.teacherDetails)
    //assign current day as semester begain day.
    this.currentDay = this.transferTimestampToTime(new Date().getTime(), 1);
    this.initFullCalendar(this);
  }

  prepareData() {
    if (!this.termPeriod) {
      this.coursesService.getoioi().subscribe(res => {
        this.termPeriod = res["Data"]
        console.log(this.termPeriod)
      })
    }

    if (!this.courses) {
      this.coursesService.getCourses().subscribe(res => {
        this.courses = res["Data"]
        console.log(this.courses)
      })
    }

    if (!this.teacherDetails) {
      let teachers;
      this.teachersService.getTeachersInfo().subscribe(res => {
        teachers = res["Data"]
        console.log(teachers)
      })

      let teachingCourses;
      this.teachersService.getTeachingCourse().subscribe(res => {
        teachingCourses = res["Data"]
        console.log(teachingCourses)
      })
    }

    this.learnersService.getLearnerById(this.LearnerId).subscribe(res => {
      let learner = res["Data"]
      this.studentFullName = learner.FirstName + ' ' + learner.LastName;
      this.LearnerLevel = learner.LearnerLevel
    })
  }

  /*
    initiate settings of full calendar mode
  */
  initFullCalendar(pointer) {
    let timeSlots = this.getAvailableTime()
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      //end time of a day
      maxTime: '20:00',
      //each grid represents 15 min
      slotDuration: '00:15',
      events: timeSlots,
      selectConstraint: timeSlots,
      select: function(info) {
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
    get teacher's available time.
      --> in order to pick a period of time to take the trial lesson.
  */
  getAvailableTime() {
    let array = [];
    array = this.checkAvailableDOW(array, this.termPeriod);
    array = this.checkAvailablePeriod(array);
    array.sort()
    let newObjArr = [];
    for (let i = 0; i < array.length; i += 2) {
      if (array[i + 1] - array[i] >= this.timeInterval30Min) {
        newObjArr.push({ "start": this.transferTimestampToTime(array[i]), "end": this.transferTimestampToTime(array[i + 1]), "rendering": 'background' })
      }
    }
    return newObjArr
  }

  /*
    get teacher availabe day in a week
  */
  getAvailabelDOW(teacherDetails) {
    let array: Array<any> = [];
    for (let i of teacherDetails.AvailableDays) {
      if (i.OrgId == this.orgId) {
        array.push(i.DayOfWeek)
      }
    }
    return array;
  }

  /*
    get available day of week in semester period
      --> if available, push this day in an array,
          else, drop it.
  */
  checkAvailableDOW(array, termPeriod?) {
    for (let i in this.availableDOW) {
      if (this.availableDOW[i] == 7) {
        this.availableDOW[i] = 0;
      }
    }
    //  --> the days befor current day are unavailable.
    if (Date.parse(termPeriod[0].EndDate) < Date.parse(this.currentDay)) {
      termPeriod = termPeriod.slice(1)
    }
    termPeriod[0].BeginDate = this.currentDay;
    console.log(this.currentDay, termPeriod)
    //outer for-loop can support multiple semesters
    for (let j of termPeriod) {
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
    events handler when user select grids on calendar
  */
  selectCallBack(info) {
    let startTimestamp = Date.parse(info.startStr);
    let endTimestamp = Date.parse(info.endStr);

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
    let array: Array<any> = [];
    for (let i of this.courses) {
      if (i.CourseType == 1 && this.teacherDetails.Level == i.TeacherLevel && i.CourseCategoryId == this.cateId
        && i.Duration == duration && i.Level == this.LearnerLevel) {
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

  /*
    get time that teacher are now having class
  */
  getTimeSlot() {
    let obj = [];
    for (let i of this.coursesTeachingByWhichTeacher) {
      obj.push({ "start": i.start, "end": i.end, "rendering": 'background' })
    }
    return obj;
  }

}
