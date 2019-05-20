import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import timeslot from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarComponent} from 'ng-fullcalendar';
declare let $: any;
import {DatePipe} from '@angular/common';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.all.min.js';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SessionsService } from 'src/app/services/http/sessions.service';
import {SessionDetailEditModalComponent} from '../../session-modals/session-detail-edit-modal/session-detail-edit-modal.component';

@Component({
  selector: 'app-sessions-calendar-view-admin',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sessions-calendar-view-admin.component.html',
  styleUrls: ['./sessions-calendar-view-admin.component.css']
})
export class SessionsCalendarViewAdminComponent implements OnInit {

  searchForm: FormGroup;
  @ViewChild('content') content;
  options: OptionsInput;
  eventsModel: any;
  id: any;
  private resourceData: any;
  private eventData = [];
  @ViewChild(CalendarComponent) fullcalendar: CalendarComponent;

  constructor(
    protected sessionService: SessionsService,
    private datePipe: DatePipe, private modalService: NgbModal,
    private fb: FormBuilder
    ) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      dateOfLesson: ['']
    })
    this.sessionService.getReceptionistRoom().subscribe(data => {
      this.resourceData = data.Data;
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.sessionService.getReceptionistLesson(date).subscribe(event => {
        this.eventsModel = this.generateEventData(event.Data);
      });
      this.options = {
        themeSystem: 'jquery-ui',
        editable: true,
        resourceLabelText: 'Rooms',
        customButtons: {
          DayPickerButton: {
            text: 'Search',
            click: () => {
              this.modalService.open(this.content);
            }
          }
        },
        eventClick: (info) => {
          Swal.fire({
              type: 'info',
              title: 'Student',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Edit',
              html: info.event.extendedProps.description
            }
          ).then(result => {
            if (result.value) {
              this.modalService.open(SessionDetailEditModalComponent, { size: 'lg' });
            }
          });
        },
        resources: this.resourceData,
        displayEventTime: false,
        events: this.eventData,
        aspectRatio: 1.8,
        timeZone: 'UTC',
        defaultView: 'resourceTimeGridDay',
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        minTime: '08:00',
        maxTime: '21:00',
        scrollTime: '08:00',
        height: 660,
        views: {
          resourceTimeGridDay: {
            buttonText: 'Day',
            slotDuration: '00:15'
          },
          resourceTimeGridWeek: {
            buttonText: 'Week',
            duration: {days: 7}
          }
        },
        header: {
          left: 'today prev,next DayPickerButton',
          center: 'title',
          right: 'resourceTimeGridDay resourceTimeGridWeek'
        },
        plugins: [timeslot, interactionPlugin]
      };
    });
  }
  clickButton = (model) => {
    if (model.buttonType === 'next' || model.buttonType === 'today' || model.buttonType === 'prev') {
      const datefromcalendar = model.data;
      const date = this.datePipe.transform(datefromcalendar, 'yyyy-MM-dd')
      this.sessionService.getReceptionistLesson(date).subscribe(event => {
        this.eventData = this.generateEventData(event.Data);
        this.eventsModel = this.eventData;
      });
    }
  }
  generateEventData = (data) => {
    data.forEach(s => {
      s.title += '\nTutor: ' + s.teacher;
      if (s.IsGroup === false) {
        s.title += '\nLearner: ' + s.student[0];
      }
      if (s.student.length === 1) {
        s.description = s.student[0];
        return data;
      }
      s.description += '<div class="row">';
      s.student.forEach(w => {
       s.description += '<div class="col-4 col-centered">' + w + '</div>';
      });
      s.description += '</div>';
    });
    return data;
  }
  search = () => {
    if (this.searchForm.get('dateOfLesson').value === '' || this.searchForm.get('dateOfLesson').value === null) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'please enter the date before submitting'
      });
      return;
    }
    const year = this.searchForm.get('dateOfLesson').value.year;
    const month = this.searchForm.get('dateOfLesson').value.month;
    const day = this.searchForm.get('dateOfLesson').value.day;
    const date = year + '-' + month + '-' + day + ' 12:00:00';
    const datetoshow = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.fullcalendar.calendar.gotoDate(datetoshow);
    this.sessionService.getReceptionistLesson(date).subscribe(event => {
      this.eventData = this.generateEventData(event.Data);
      this.eventsModel = this.eventData;
    });
  }
}
