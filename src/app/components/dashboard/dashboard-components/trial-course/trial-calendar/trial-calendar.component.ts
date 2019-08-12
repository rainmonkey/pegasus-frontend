import { TrialConfirmationComponent } from './../trial-confirmation/trial-confirmation.component';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TrialCoursesService } from 'src/app/services/http/trial-courses.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-trial-calendar',
  templateUrl: './trial-calendar.component.html',
  styleUrls: ['./trial-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrialCalendarComponent implements OnInit {
  public options: OptionsInput;
  public timeSlots: any;
  @Input() teacher: Object;
  @Input() orgName: string;
  @Input() orgId: number;
  @Input() courseCategoryName: string;
  @Input() CourseCategoryId: number;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private trialService: TrialCoursesService
  ) { }

  ngOnInit() {
    this.getDataFromServer().subscribe(
      (res) => {
    
        let coursesSlots = res[0]['Data'].map(
          (val)=>{
            val.title = val.roomName;
            return val;
          }
        )
        this.timeSlots = this.calculateAvaliableTimeSlots(res[1]['Data']);
        this.initializeFullCalendar(coursesSlots, this.timeSlots);
      }
    );
  }

  /**
   * Get datas from server with several apis.
   * @returns {Observable} observable of data (coursesOfATeacher, terms of a year)
   */
  getDataFromServer(): Observable<Array<object>> {
    let apiRequests: Array<any> = [];
    apiRequests.push(this.trialService.getTeacherCoursesbyId(this.teacher['TeacherId']));
    apiRequests.push(this.trialService.getTermsDuration());
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
    let dayOfWeek: Array<number> = this.getDayOfWeek(this.teacher);
    /**@property {Array<object>} avaliableTermDuration - avaliable term duration*/
    let avaliableTermDuration: Array<object> = this.getAvaliableTermDuration(terms);
    /**@property {Array<object>} avaliableTimeSlots - a list saved avaliable time slots and returned at the end of function */
    let avaliableTimeSlots: Array<object> = [];
    const millisecOfOneDay: number = 86400000;

    /**To estimate whether a day is avaliable*/
    avaliableTermDuration.map(
      (val) => {
        let endDateTimeStamp = new Date(val['EndDate']).getTime();
        //start date is from current day(days before current day are all unavaliable)
        let startDateTimeStamp = new Date().getTime();
        //iterator of term's duration times
        for (let i = startDateTimeStamp; i < endDateTimeStamp; i += millisecOfOneDay) {
          let date = new Date(i);

          let weekDay = date.getDay() == 0 ? 7 : date.getDay();
          let year = date.getFullYear();
          let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
          let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

          if (dayOfWeek.includes(weekDay)) {
            avaliableTimeSlots.push({
              start: `${year}-${month}-${day}T00:00:00`,
              end: `${year}-${month}-${day}T23:59:59`,
              rendering: 'background'
            });
          }
        }
      }
    )
    return avaliableTimeSlots;
  }

  /**
   * Get teacher avaliable days of one week.
   * @param teacher - teacher's object
   * @returns {Array<number>} array of avaliable days of one week
   */
  getDayOfWeek(teacher: object) {
    let array: Array<number> = [];
    teacher['AvailableDays'].map(
      (val) => {
        array.push(val.DayOfWeek)
      }
    )
    return array;
  }

  /**
   * Get avaliable term durations(current and incoming terms)
   * @param terms - all terms in a year
   */
  getAvaliableTermDuration(terms) {
    /**@property {number} timeStampOfToday - stamp of today */
    let timeStampOfToday: number = new Date().getTime();
    let avaliableTermDuration: Array<object> = terms.filter(
      (val) => {
        /**@property {number} - end date time stamp of each term*/
        let timeStamp: number = new Date(val['EndDate']).getTime();
        if (timeStamp > timeStampOfToday) {
          return val;
        }
      }
    )
    return avaliableTermDuration;
  }

  /**
   * Full calendar's configuration.
   * @param coursesTimeSlots - time slots of existed sessions.
   * @param avaliableDaySlots - time slots of teacher's avaliable days in one or more terms.
   */
  initializeFullCalendar(coursesTimeSlots: Array<object>, avaliableDaySlots: Array<any>) {
    let that = this;
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      maxTime: '20:00',
      slotDuration: '00:15',
      eventSources: [coursesTimeSlots,
        avaliableDaySlots],
      eventBackgroundColor: 'lightblue',
      selectMirror: true,
      selectOverlap: function (event) {
        return event.rendering === 'background';
      },
      selectConstraint: avaliableDaySlots,
      select(info) {
        that.selectSlot(info);
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    }
  }

  /**
   * Call back function of full calendar select.
   * If selected time slots >= 30 min and <= 60 min, popup confirmation modal.   
   * @param info - infomation of select event
   */
  selectSlot(info) {
    const milliSecIn30Min = 1800000;
    const milliSecIn60Min = 3600000;
    let startStr = info.startStr;
    let startTimeStamp = new Date(startStr).getTime();
    let endStr = info.endStr;
    let endTimeStamp = new Date(endStr).getTime();
    let differTimeStamp = endTimeStamp - startTimeStamp;

    if (differTimeStamp >= milliSecIn30Min && differTimeStamp <= milliSecIn60Min) {
      this.popUpConfirmationModal(startTimeStamp, endTimeStamp, startStr, endStr);
    }
  }

  /**
   * Pop up confirm modal.
   * @param courseStartTime - start time stamp
   * @param courseEndTime - end time stamp
   * @param startStr - start time string
   * @param endStr - end time string 
   */
  popUpConfirmationModal(courseStartTime: number, courseEndTime: number, startStr: string, endStr: string) {
    const modalRef = this.modalService.open(TrialConfirmationComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.confirmationData = {
      teacherId: this.teacher['TeacherId'],
      teacherName: this.teacher['FirstName'] + '  ' + this.teacher['LastName'],
      startTimeStamp: courseStartTime,
      endTimeStamp: courseEndTime,
      orgId: this.orgId,
      orgName: this.orgName,
      cateName: this.courseCategoryName,
      cateId: this.CourseCategoryId,
      teacher: this.teacher,
      startStr: startStr,
      endStr: endStr
    }
    modalRef.componentInstance.isClosed.subscribe(
      (res) => {
        this.activeModal.close('Close click');
      }
    )
  }
}
