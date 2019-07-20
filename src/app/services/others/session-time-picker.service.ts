import { Injectable } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import timeGridPlugin from '@fullcalendar/timegrid';

@Injectable({
  providedIn: 'root'
})
export class SessionTimePickerService {

  public options: OptionsInput

  constructor() { }

  /*
    initiate settings of full calendar mode
  */
  initFullCalendar(thisComponent) {
    thisComponent.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      //end time of a day
      maxTime: '20:00',
      //each grid represents 15 min
      slotDuration: '00:15',
      select: info => { thisComponent.selectCallBack(info) },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    };
  }

  /*
    transfer time stamp to the timeStr that fullcalendar can read.
  */
  transferTimestampToTime(timestamp, code?) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + 'T';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (code == 1) {
      return Y + M + D + '00:00:00';
    }
    else {
      return Y + M + D + h + m + s;
    }
  }
}
