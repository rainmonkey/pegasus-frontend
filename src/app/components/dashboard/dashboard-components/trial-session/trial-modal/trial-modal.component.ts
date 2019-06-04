import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None})
export class TrialModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let calendarE1 = document.getElementById('calendar');
    if(calendarE1!==undefined){
      let calendar = new Calendar(calendarE1,{
        plugins:[ timeGridPlugin, interactionPlugin ],
        minTime: "09:00:00",
        maxTime: "18:00:00",
        height:600,
        selectable:true
      });
      calendar.render();
    }
  }

}
