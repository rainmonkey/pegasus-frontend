import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddHolidayModalComponent } from '../add-holiday-modal/add-holiday-modal.component';
import { View } from '@fullcalendar/core';


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
  existHoliday: any
  holidayArray = []
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  @ViewChild('addHoliday') addHoliday:AddHolidayModalComponent
  constructor(
    private HolidayServer: HolidaysService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getExitHoliday()
    console.log(this.fullcalendar)
    this.initFullCalendar(this)
    console.log(this)

  }


  getExitHoliday() {
    this.HolidayServer.getHoliday().subscribe(
      (res) => {
        this.eventsModel = this.putInfo(res.Data)
        console.log(this.eventsModel)
      },
      (err) => {
        alert('something wrong')
      }
    )
  }

  initFullCalendar(pointer) {
    let that = pointer;
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      select: function(info) {
        that.open(info)
      },
      eventClick: (info) => {
        console.log(info)
        Swal.fire({
          type: 'info',
          html: info.event.extendedProps.description
        }
        );
      },
    }
  }



  putInfo(h) {
    for (let i of h) {
      this.holidayArray.push({ "title": i.HolidayName, "date": i.HolidayDate })
    }
    return this.holidayArray;
  }

  open(info) {
    const modalRef = this.modalService.open(AddHolidayModalComponent)
    modalRef.componentInstance.date = info;
  }


}
