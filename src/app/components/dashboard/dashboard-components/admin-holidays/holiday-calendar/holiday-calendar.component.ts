import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import { Calendar } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddHolidaysModalComponent } from '../add-holidays-modal/add-holidays-modal.component';
import { View } from '@fullcalendar/core';
import { DeleteHolidayComponent } from '../delete-holiday/delete-holiday.component';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { dateToLocalArray } from '@fullcalendar/core/datelib/marker';
import * as moment from 'moment/moment.js'
import { SelectHolidaysModalComponent } from '../select-holidays-modal/select-holidays-modal.component';


@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayCalendarComponent implements OnInit {
  public calendar
  eventsModel;
  options: OptionsInput;
  existHoliday: any
  holidayArray = []
  private eventData = [];
  selectDate = []

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
      (event) => {
        const eventData = this.putInfo(event.Data)
        this.eventsModel = eventData
      },
      (err) => {
        alert('something wrong')
      }
    )
  }

  initFullCalendar(pointer) {
    console.log(this.fullcalendar)
    let that = pointer;
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      select: function (info) {
        that.test(info)
      },
      // dateClick: function (info) {
      //   console.log(info)
      //   that.addAndEdit(info)
      // },
      eventClick: (info) => {
        // console.log(info)
        that.delete(info)
      },
      eventTextColor: '#ffffff',
    }
  }

  test(info) {
  //   this.selectDate = []
  //   console.log(info)
  //   let beginDate = info.start
  //   const endDate = (info.end).setDate((info.end).getDate()-1)
  // //  while (moment(beginDate).isBefore(endDate))
  // for (beginDate; moment(beginDate).isBefore(endDate)||moment(beginDate).isSame(endDate);) {
  //   console.log(beginDate)
  //   this.selectDate.push(beginDate)
  //   beginDate.setDate(beginDate.getDate() + 1)


  //   }

  //   console.log(this.selectDate)
  //   return
  const modalRef = this.modalService.open(SelectHolidaysModalComponent)
    let that = this;
    modalRef.componentInstance.date = info;
    modalRef.componentInstance.refreshFlag.subscribe(
      (res) => {
        modalRef.result.then(
          function () {
            // console.log(res)
            if (res == true) {
              that.fullcalendar.calendar.removeAllEvents();
              that.getExitHoliday()
              that.initFullCalendar(this)
            }
          },
          function () {
            return;
          })
      }
    )

  }

  putInfo(h) {
    this.holidayArray = [];
    for (let i of h) {
      this.holidayArray.push({ 'id': i.HolidayId, "title": i.HolidayName, "date": i.HolidayDate })
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
            // console.log(res)
            if (res == true) {
              that.fullcalendar.calendar.removeAllEvents();
              that.getExitHoliday()
              that.initFullCalendar(this)
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
    let that = this;
    modalRef.componentInstance.date = info;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
    )

  }
}
