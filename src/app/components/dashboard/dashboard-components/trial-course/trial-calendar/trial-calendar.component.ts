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

  constructor(
    private activeModal: NgbActiveModal,
    private trialService: TrialCoursesService
  ) { }

  ngOnInit() {
    this.getDataFromServer().subscribe(
      (res) => {
        console.log(res);
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
   */
  calculateAvaliableTimeSlots(terms: Array<object>) {
    /**@property {Array<number>} dayOfWeek - teacher's avaliable day of one week */
    let dayOfWeek: Array<number> = this.getDayOfWeek();
    /**@property {Array<object>} termDuationAfterFilter - a list saved avaliable term duration */
    let termDuationAfterFilter: Array<object> = this.getAvaliableTermDuration(terms);
    const millisecOfOneDay: number = 86400000;
    let avaliableTimeSlots: Array<object> = []

    termDuationAfterFilter.map(
      (val) => {
        let endDateTimeStamp = new Date(val['EndDate']).getTime();
        let startDateTimeStamp = new Date().getTime();
        //console.log(endDateTimeStamp)
        for (let i = startDateTimeStamp; i < endDateTimeStamp; i += millisecOfOneDay) {
          let date = new Date(i);

          let weekDay = date.getDay() == 0 ? 7 : date.getDay();
          let year = date.getFullYear();
          let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
          let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

          console.log(dayOfWeek)
          console.log(weekDay)
          console.log(dayOfWeek.includes(weekDay))
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
    console.log(termDuationAfterFilter)
    console.log(this.teacher)
    console.log(dayOfWeek)
    console.log(avaliableTimeSlots)
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
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      maxTime: '20:00',
      slotDuration: '00:15',
      eventSources: [coursesTimeSlots,
        avaliableDaySlots],
      //events: coursesTimeSlots,
      eventBackgroundColor: 'lightblue',
      selectMirror: true,
      selectOverlap: function (event) {
        return event.rendering === 'background';
      },
      selectConstraint: avaliableDaySlots,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    }
  }

  timeSlot() {
    return [{ start: '2019-08-12T09:00:00', end: '2019-06-12T09:30:00' }]
    // return setTimeout(()=>{
    //   return [ { start: '2019-08-12T09:00:00', end: '2019-06-12T09:30:00'}]
    // },3000)
  }
}
