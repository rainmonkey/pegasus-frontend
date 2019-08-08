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

  @Input() teacher: Object;
  @Input() orgName: string;
  @Input() orgId:number;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private trialService: TrialCoursesService
  ) { }

  ngOnInit() {
    this.getDataFromServer().subscribe(
      (res) => {
        let timeSlots = this.calculateAvaliableTimeSlots(res[1]['Data']);
        this.initializeFullCalendar(res[0]['Data'], timeSlots);
      }
    );
  }

  /**
   * Get datas from server with several apis.
   * @returns {Observable} array of data (Array[0]: coursesOfATeacher; Array[1]: terms of a year)
   */
  getDataFromServer(): Observable<Array<object>> {
    let apiRequests: Array<any> = [];
    apiRequests.push(this.trialService.getTeacherCoursesbyId(this.teacher['TeacherId']));
    apiRequests.push(this.trialService.getTermsDuration());
    return forkJoin(apiRequests);
  }

  /**
   * calculate avaliable time slots that user can select on calendar.
   * @param terms - terms of a year
   * @returns {Array<object>} list of avaliable time slots after calculation
   */
  calculateAvaliableTimeSlots(terms: Array<object>) {
    /**@property {Array<number>} dayOfWeek - teacher's avaliable day of one week */
    let dayOfWeek: Array<number> = this.getDayOfWeek();
    /**@property {Array<object>} termDuationAfterFilter - a list saved avaliable term duration */
    let termDuationAfterFilter: Array<object> = this.getAvaliableTermDuration(terms);
    const millisecOfOneDay: number = 86400000;
    /**@property {Array<object>} avaliableTimeSlots - a list saved avaliable time slots and returned at the end of function */
    let avaliableTimeSlots: Array<object> = []

    /**push teacher avaliable days in term durations */
    termDuationAfterFilter.map(
      (val) => {
        let endDateTimeStamp = new Date(val['EndDate']).getTime();
        //start date is current day
        let startDateTimeStamp = new Date().getTime();
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
   * @returns {Array<number>} array of days of week
   */
  getDayOfWeek() {
    let array: Array<number> = [];
    this.teacher['AvailableDays'].map(
      (val) => {
        array.push(val.DayOfWeek)
      }
    )
    return array;
  }

  /**
   * Get avaliable term durations(unfinished terms)
   * @param terms - terms of a year
   */
  getAvaliableTermDuration(terms) {
    let timeStampOfToday: number = new Date().getTime();
    let termDuationAfterFilter: Array<object> = terms.filter(
      (val) => {
        /**@property {number} - end date time stamp of each term*/
        let timeStamp: number = new Date(val['EndDate']).getTime();
        if (timeStamp > timeStampOfToday) {
          return val;
        }
      }
    )
    return termDuationAfterFilter;
  }



  initializeFullCalendar(coursesTimeSlots: Array<object>, avaliableDaySlots) {
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
    if (differTimeStamp >= milliSecIn30Min && differTimeStamp <= milliSecIn60Min)
      this.popUpConfirmationModal(startTimeStamp, endTimeStamp);
  }

  popUpConfirmationModal(courseStartTime, courseEndTime) {
    const modalRef = this.modalService.open(TrialConfirmationComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    //this.prepareConfirmationData(courseStartTime, courseEndTime);
    modalRef.componentInstance.confirmationData = {
      teacherId: this.teacher['TeacherId'],
      teacherName:  this.teacher['FirstName'] + '  ' + this.teacher['LastName'],
      startTimeStamp: courseStartTime,
      endTimeStamp:courseEndTime,
      orgId:this.orgId,
      orgName:this.orgName,
    }

    //this.orgName
  }
}
