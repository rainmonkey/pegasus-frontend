import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarComponent} from 'ng-fullcalendar';
//declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None})

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
      select: (info)=>{
        alert(info.start)
      },
      maxTime: '21:00',
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
