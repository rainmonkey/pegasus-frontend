import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css']
})
export class HolidayCalendarComponent implements OnInit {
  @Input() options
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  constructor() { }

  ngOnInit() {
    this.initFullCalendar();

  }

  initFullCalendar() {

}
}
