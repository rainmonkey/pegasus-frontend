import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
//declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { reduce } from 'rxjs/operators';


@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrialModalComponent implements OnInit {
  options: OptionsInput;

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  eventsModel: any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      select: (info) => {
        
      },
      selectConstraint: {
        // daysOfWeek: [1, 2, 3], //周
        // startTime: '10:00',
        // endTime: '13:10'
        start: '2019-06-02T12:00:00',
        end: '2019-06-02T13:00:00',
      },
      businessHours: [
        {
          daysOfWeek: [1],
          startTime: '09:00',
          endTime: '09:00'
        },


      ],
      events: [{
        id: 'available_hours',
        start: '2019-06-02T12:00:00',
        end: '2019-06-02T13:00:00',
        // constraint:{
        //   startTime: '2019-06-02T12:00:00',
        //    endTime:   '2019-06-02T13:00:00',
        // },
        rendering: 'background'
      }
      ],
      minTime: '09:00',
      slotDuration: '00:15',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    };
  }

}
