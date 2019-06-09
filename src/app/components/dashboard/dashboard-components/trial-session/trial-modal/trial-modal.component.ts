import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
//declare let $: any;
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { reduce } from 'rxjs/operators';



@Component({
  selector: 'app-trial-modal',
  templateUrl: './trial-modal.component.html',
  styleUrls: ['./trial-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrialModalComponent implements OnInit {
  public timeslot: Array<any> = [
    { "start": "2019-06-04T09:00:00", "end": "2019-06-04T09:30:00", "rendering": 'background', },
    { "start": "2019-06-04T11:30:00", "end": "2019-06-04T12:00:00", "rendering": 'background', },
    { "start": "2019-06-04T13:00:00", "end": "2019-06-04T14:00:00", "rendering": 'background', },
    { "start": "2019-06-04T15:00:00", "end": "2019-06-04T16:00:00", "rendering": 'background', },
    { "start": "2019-06-04T16:30:00", "end": "2019-06-04T17:00:00", "rendering": 'background', }
  ];
  public timeInterval30Min = 1800000;
  options: OptionsInput;

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  eventsModel: any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    //this.getAvailableTime();
    this.options = {
      allDaySlot: false,
      height: 700,
      selectable: true,
      minTime: '09:00',
      maxTime: '18:00',
      slotDuration: '00:15',
      businessHours: [],
          // resourceIds: 'unAvailable'},
        // {
        //   startTime:"09:00",
        //   endTime:"18:00",
        //   daysOfWeek:[1,3,5],
        // },],
      // eventSources: [{
      //   events: this.timeslot,
      //   color: 'lightgrey',
      // }],
      events:this.getAvailableTime(),
      selectConstraint: this.getAvailableTime(),
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      plugins: [timeGridPlugin, interactionPlugin]
    };
  }



  getAvailableTime() {
    //console.log(Date.parse(this.timeslot[0].start) - Date.parse(this.timeslot[0].end));
    let array = [];
    //增加一个课程开始的时间 api需要加字段
    array.push(Date.parse("2019-05-20T09:00:00"))
    for (let i of this.timeslot) {
      array.push(Date.parse(i.start));
      array.push(Date.parse(i.end))
    }
    //增加一个课程结束的时间 api需要加字段
    array.push(Date.parse("2019-06-04T18:00:00"))


    let newObjArr = [];
    for (let i = 0; i < array.length; i += 2) {
      if (array[i + 1] - array[i] >= this.timeInterval30Min) {
        newObjArr.push({ "start": this.transferTimestampToTime(array[i]), "end": this.transferTimestampToTime(array[i + 1]),"rendering": 'background', })
      }
    }
    // newObjArr.push( {
    //   startTime:'09:00',
    //   endTime:'18:00',
    //   daysOfWeek:[1,2,3,4,5]
    // })
    console.log(newObjArr)
    return newObjArr
  }

  /*
    transfer time stamp to the timeStr that fullcalendar can read.
  */
  transferTimestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + 'T';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + h + m + s;
  }
}
