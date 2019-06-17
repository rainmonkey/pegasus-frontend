import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddHolidaysModalComponent } from '../add-holidays-modal/add-holidays-modal.component';
import { View } from '@fullcalendar/core';
import { DeleteHolidayComponent } from '../delete-holiday/delete-holiday.component';


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

  constructor(
    private HolidayServer: HolidaysService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getExitHoliday()
    console.log(this.fullcalendar)
    this.initFullCalendar(this)
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
      // select: function(info) {
      //   console.log(info)
      //   that.open(info)
      // },
      dateClick: function (info) {
        console.log(info)
        that.addAndEdit(info)
      },
      eventClick: (info) => {
        console.log(info)
        that.delete(info)
      },
    }
  }



  putInfo(h) {
    for (let i of h) {
      this.holidayArray.push({'id':i.HolidayId, "title": i.HolidayName, "date": i.HolidayDate })
    }
    return this.holidayArray;
  }

  addAndEdit(info) {
    const modalRef = this.modalService.open(AddHolidaysModalComponent)
    let that = this;

    modalRef.componentInstance.date = info;
    modalRef.componentInstance.refreshFlag.subscribe(
      (res) => {
        modalRef.result.then(
          function () {
            console.log(res)
            if (res == true) {
              that.ngOnInit();
            }
          },
          function () {
            return;
          })
      }
    )
  }

  delete(info) {
    const modalRef = this.modalService.open(DeleteHolidayComponent)
    let that =this;

    modalRef.componentInstance.date = info;
    // modalRef.componentInstance.refreshFlag.subscribe(
    //   (res) => {
    //     modalRef.result.then(
    //       function () {
    //         console.log(res)
    //         if (res == true) {
    //           that.ngOnInit();
    //         }
    //       },
    //       function () {
    //         return;
    //       })
    //   }
    // )
  }

}
