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
        console.log('aaaaaaaaaaaaa');
        //this.fullcalendar.ngAfterViewInit();
        this.eventData=this.putInfo(event.Data)
        this.eventsModel = this.eventData
        console.log(this.eventsModel)
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
      // select: function (info) {
      //   console.log(info)

      // },
      dateClick: function (info) {
        console.log(info)
        that.addAndEdit(info)
      },
      eventClick: (info) => {
        console.log(info)
        that.delete(info)
      },
      eventTextColor:'#ffffff'
    }
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
    let that = this;

    modalRef.componentInstance.date = info;
    modalRef.result.then(
      (res) => {
        //this.fullcalendar.calendar.removeAllEvents();
        //this.fullcalendar.calendar.destroy();
        that.ngOnInit()

      },
      (err) => {
        return
      }
    )

  }

}
