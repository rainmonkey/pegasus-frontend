import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput } from '@fullcalendar/core';
import { HolidaysService } from 'src/app/services/http/holidays.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteHolidayComponent } from '../delete-holiday/delete-holiday.component';
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
        const eventData = this.putInfo(event.Data);
        this.eventsModel = eventData;
      },
      (err) => {
        alert('something wrong')
      }
    )
  }

  initFullCalendar(pointer) {
    console.log(this.fullcalendar);
    let that = pointer;
    this.options = {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      select: function (info) {
        that.test(info)
      },
      eventClick: (info) => {
        // console.log(info)
        that.delete(info)
      },
      eventTextColor: '#ffffff',
    }
  }

  test(info) {
  const modalRef = this.modalService.open(SelectHolidaysModalComponent,{ backdrop: 'static', keyboard: false })
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

  delete(info) {
    const modalRef = this.modalService.open(DeleteHolidayComponent,{ backdrop: 'static', keyboard: false })
    let that = this;
    modalRef.componentInstance.date = info;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
    )

  }
}
