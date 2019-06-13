import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddHolidayModalComponent } from '../add-holiday-modal/add-holiday-modal.component';


@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayCalendarComponent implements OnInit {
  public calendar: any
  eventsModel;
  options: OptionsInput;
  existHoliday:any
  holidayArray =[]
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;

  constructor(
    private HolidayServer: HolidaysService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  this.getExitHoliday()
    console.log(this.fullcalendar)
    this.initFullCalendar()

  }


  getExitHoliday() {
    this.HolidayServer.getHoliday().subscribe(
    (res)=>{
      this.eventsModel=this.putInfo(res.Data)
      console.log(this.eventsModel)
    },
    (err)=>{
      alert('something wrong')
    }
    )
  }

  initFullCalendar() {
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      dateClick:function(info){
        console.log(info)
      this.open(info)
      },

      // select: function(info) {
      //   alert("selected " + info.startStr + " to " + info.endStr);
      // },
      eventClick: (info) => {
      Swal.fire({
          type: 'info',
          html: info.event.extendedProps.description
        }
      );
    },
    }
  }



  putInfo(h){
    for(let i of h){
      this.holidayArray.push({"title":i.HolidayName,"date":i.HolidayDate})
    }
    return this.holidayArray;
  }

open(info){
 const modalRef= this.modalService.open(AddHolidayModalComponent)
  // modalRef.componentInstance
}


}
