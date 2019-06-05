import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import {OptionsInput} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarComponent} from 'ng-fullcalendar';
declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import { copyStyles } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None})
export class TrialModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  //   let calendarE1 = document.getElementById('calendar');
  //   if(calendarE1!==undefined){
  //     let calendar = new Calendar(calendarE1,{
  //       plugins:[ timeGridPlugin, interactionPlugin ],
  //       allDaySlot: false,
  //       header: {
  //         left: 'prev,next today',
  //         center: 'title',
  //         right: 'timeGridWeek'
  //       },
  //       businessHours: {
  //         // days of week. an array of zero-based day of week integers (0=Sunday)
  //         daysOfWeek: [ 1, 2, 3, 4 ], // Monday - Thursday
        
  //         startTime: '10:00', // a start time (10am in this example)
  //         endTime: '18:00', // an end time (6pm in this example)
  //       },
  //       minTime: "09:00:00",
  //       maxTime: "18:00:00",
  //       height:600,
  //       selectable:true,
  //       select(selectInfo){
  //         alert(selectInfo.startStr)
  //       },
  //     });
  //     calendar.render();
  //   }
  }

}
