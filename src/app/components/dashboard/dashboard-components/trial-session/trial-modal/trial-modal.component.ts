import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarComponent} from 'ng-fullcalendar';
declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None})
export class TrialModalComponent implements OnInit {
  options: OptionsInput;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  eventsModel: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      editable: true,
      height: 700,
      displayEventTime: false,
      maxTime: '22:00',
      minTime: '08:00',
      scrollTime: '08:00',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      slotDuration: '00:15',
      plugins: [timeGridPlugin]
    };
  }

}
