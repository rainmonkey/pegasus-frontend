import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar } from '@fullcalendar/core';
import { OptionsInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayCalendarComponent implements OnInit {
  public calendar:any

  options: OptionsInput;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  constructor() { }

  ngOnInit() {
    this.initFullCalendar();
    console.log(this.fullcalendar)

  }


  initFullCalendar() {
    this.options ={
      plugins: [dayGridPlugin, interactionPlugin],

    }
}


}
