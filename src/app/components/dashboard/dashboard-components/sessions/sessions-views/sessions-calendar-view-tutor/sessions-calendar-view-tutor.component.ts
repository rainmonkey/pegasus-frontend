import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarComponent} from 'ng-fullcalendar';
declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import {SessionsService} from '../../../../../../services/http/sessions.service';

@Component({
  selector: 'app-sessions-calendar-view-tutor',
  templateUrl: './sessions-calendar-view-tutor.component.html',
  styleUrls: ['./sessions-calendar-view-tutor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SessionsCalendarViewTutorComponent implements OnInit {
  options: OptionsInput;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  eventsModel: any;
  constructor(private sessionsService: SessionsService) { }
  ngOnInit() {
    this.sessionsService.getTeacherLesson().subscribe(data => {
      this.eventsModel = this.generateEventData(data.Data);
      this.options = {
        editable: true,
        height: 700,
        maxTime: '22:00',
        minTime: '08:00',
        scrollTime: '08:00',
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek'
        },
        slotDuration: '00:15',
        eventClick: (info) => {
          Swal.fire({
              type: 'info',
              html: info.event.extendedProps.description
            }
          );
        },
        events: data.Data,
        plugins: [timeGridPlugin]
      };
    });
  }
  generateEventData = (data) => {
    data.forEach(s => {
      s.description += '<h4>Students Name</h4><div class="row">';
      if (s.student.length === 1) {
        s.description = '<h4>Students Name</h4>' + s.student[0];
        s.description += '</div><h4>Room Name</h4>' + s.roomName + ' (' + s.orgName + ')'
          + '<h4>Course Name</h4>' + s.courseName;
        return data;
      }
      s.student.forEach(w => {
        s.description += '<div class="col-4">' + w + '</div> ';

      });
      s.description += '</div><h4>Room Name</h4>' + s.roomName + ' (' + s.orgName + ')'
                        + '<h4>Course Name</h4>' + s.courseName;
    });
    return data;
  }

}
