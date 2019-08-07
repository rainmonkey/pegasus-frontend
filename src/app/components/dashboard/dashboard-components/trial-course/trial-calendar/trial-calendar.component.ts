import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TrialCoursesService } from 'src/app/services/http/trial-courses.service';

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
    
    this.initializeFullCalendar();
  }


  initializeFullCalendar() {
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      maxTime: '20:00',
      slotDuration: '00:15',
      events: this.timeSlot(),
      //selectConstraint: this.timeSlots,
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
