import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  // data will from server, now just hard core
  public teacherAvailableData: any = {
    "IsSuccess": true,
    "ErrorCode": null,
    "IsFound": true,
    "ErrorMessage": null,
    "Data": {
        "AvailableDay": [
            {
                "DayOfWeek": 3,
                "Orgs": [
                    {
                        "OrgId": 1,
                        "OrgName": "CENTRAL AUCKLAND BRANCH"
                    },
                    {
                        "OrgId": 1,
                        "OrgName": "CENTRAL AUCKLAND BRANCH"
                    },
                    {
                        "OrgId": 1,
                        "OrgName": "CENTRAL AUCKLAND BRANCH"
                    }
                ]
            },
            {
                "DayOfWeek": 7,
                "Orgs": [
                    {
                        "OrgId": 2,
                        "OrgName": "EPSOM BRANCH"
                    }
                ]
            }
        ],
        "Arranged": [
            {
                "DayOfWeek": 6,
                "TimeBegin": "13:00:00",
                "TimeEnd": "14:00:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 2
            },
            {
                "DayOfWeek": 3,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 17
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 18
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "John123456 Key",
                "CourseScheduleId": 19
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 34
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 35
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 36
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 38
            },
            {
                "DayOfWeek": 1,
                "TimeBegin": "13:00:00",
                "TimeEnd": "14:00:00",
                "LearnerName": "Group",
                "CourseScheduleId": 3
            },
            {
                "DayOfWeek": 2,
                "TimeBegin": "14:00:00",
                "TimeEnd": "15:00:00",
                "LearnerName": "Group",
                "CourseScheduleId": 4
            }
        ],
        "Dayoff": [
            {
                "DayOfWeek": 1,
                "TimeBegin": "08:00:00",
                "TimeEnd": "09:00:00",
                "LearnerName": "Daisy Liu Deng",
                "CourseScheduleId": 1
            }
        ],
        "TempChange": [
            {
              "DayOfWeek": 1,
              "TimeBegin": "10:00:00",
              "TimeEnd": "11:00:00",
              "LearnerName": "Daisy Liu",
              "CourseScheduleId": null
            }
        ]
    }
  };
  // define day(x) and slot(y)
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex: number[]= [0, 1, 2, 3, 4, 5, 6];
  public yIndex: number[] = [];
  // define type of slot 
  public slotArranged: any[] = [];
  public slotAvailable: any[] = [];
  public slotDayOff: any[] = [];
  public slotTempChange: any[] = [];
  public slotTime: any[] = [];
  // redefine arranged
  public arrangedXYobj = {};
  public arrangedXYarr: any[] = [];
  public slotArrangedLearnerName: any[] = [];
  // redefine dayoff
  public dayOffXYobj = {};
  public dayOffXYarr: any[] = [];
  public slotDayOffLearnerName: any[] = [];
  // redefine temp change
  public tempChangeXYobj = {};
  public tempChangeXYarr: any[] = [];
  public slotTempChangeLearnerName: any[] = [];

  public clickXY: any[] = [];
  public confirmTime: any[] = [];
 
 
  // for test
  public test : any;
  constructor(private timePickerService: TimePickerService) {
  }

  ngOnInit() {
    // define yIndex
    for(let i = 0; i < 49; i++) {
      this.yIndex.push(i);
    }
    // define five type of slots 
    for (let i = 0; i < 7; i++) {
      this.slotArranged[i] = [];
      this.slotAvailable[i] = [];
      this.slotDayOff[i] = [];
      this.slotTempChange[i] = [];
      this.slotArrangedLearnerName[i] = [];
      this.slotDayOffLearnerName[i] = [];
      this.slotTempChangeLearnerName[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slotArranged[i][j] = null;
        this.slotAvailable[i][j] = null;
        this.slotDayOff[i][j] = null;
        this.slotTempChange[i][j] = null;
        this.slotArrangedLearnerName[i][j] = null;
        this.slotDayOffLearnerName[i][j] = null;
        this.slotTempChangeLearnerName[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
      }
    }
    console.log('slot time', this.slotTime);
    console.log('slot arranged', this.slotArranged);
    console.log('slot available', this.slotAvailable);
    // this.getDataFromServer(1, '2019-5-01');
    this.refactorArranged();
    this.renderArranged();
    this.renderAvailableDay();
    this.refactorDayOff();
    this.renderDayOff();
    this.refactorTempChange();
    this.renderTempChange();
  }
  
  // get teacherAvailableData from server
  // getDataFromServer(teacherId: number, startDate: any) {
  //   this.timePickerService.getTeacherAvailableCheck(1, '2019-5-01').subscribe(
  //     data => {
  //       this.teacherAvailableData = data.Data;
  //       console.log('teacherAvailableData', this.teacherAvailableData);
  //     },
  //     err => {
  //       console.log('teacherAvailableData err', err);
  //     }
  //   )
  // }



  // arranged part
  refactorArranged() {
    for(let arranged of this.teacherAvailableData.Data.Arranged) {
      // convert begin time to y
      let TimeBeginToArr = arranged.TimeBegin.split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes-480)/15;
      // convert end time to y
      let TimeEndToArr = arranged.TimeEnd.split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes-480)/15;
      // redefine arranged data from server
      this.arrangedXYobj = {};
      this.arrangedXYobj['dayOfWeek'] = arranged.DayOfWeek;
      this.arrangedXYobj['beginY'] = beginMinutesToY;
      this.arrangedXYobj['endY'] = endMinutesToY;
      this.arrangedXYobj['learnerName'] = arranged.LearnerName;
      this.arrangedXYarr.push(this.arrangedXYobj);
    }
    console.log('arrangedXYarr', this.arrangedXYarr);
  }
  renderArranged() {
    this.arrangedXYarr.map((o, i) => {
      this.slotArrangedLearnerName[o['dayOfWeek']-1][o['beginY']] = [o['learnerName']];
      for(let i = o['beginY']; i < o['endY']+1; i++) {
        this.slotArranged[o['dayOfWeek']-1][i] = 'isArranged';}
    });
    console.log('slotArranged', this.slotArranged);
  }
  // available part
  renderAvailableDay() {
    this.teacherAvailableData.Data.AvailableDay.map((o, i) => {
      for(let i = 0; i < 49; i++) {
        this.slotAvailable[o['DayOfWeek']-1][i] = 'isAvailable';
      //   if(this.slotArranged[o['DayOfWeek']-1][i] = 'isArranged') {
      //     // this.slotArrangedLearnerName
      //     this.test = i;
      //     this.slotAvailable[o['DayOfWeek']-1][i] = 'isAvailable';
      //   }
      }
    });
    console.log('slotAvailable', this.test, this.slotAvailable);
  }
  refactorDayOff() {
    for(let dayoff of this.teacherAvailableData.Data.Dayoff) {
      // convert begin time to y
      let TimeBeginToArr = dayoff.TimeBegin.split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes-480)/15;
      // convert end time to y
      let TimeEndToArr = dayoff.TimeEnd.split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes-480)/15;
      // redefine arranged data from server
      this.dayOffXYobj = {};
      this.dayOffXYobj['dayOfWeek'] = dayoff.DayOfWeek;
      this.dayOffXYobj['beginY'] = beginMinutesToY;
      this.dayOffXYobj['endY'] = endMinutesToY;
      this.dayOffXYobj['learnerName'] = dayoff.LearnerName;
      this.dayOffXYarr.push(this.dayOffXYobj);
    }
    console.log('dayOffXYarr', this.dayOffXYarr);
  }
  // day off part
  renderDayOff() {
    this.dayOffXYarr.map((o, i) => {
      this.slotDayOffLearnerName[o['dayOfWeek']-1][o['beginY']] = [o['learnerName']];
      for(let i = o['beginY']; i < o['endY']+1; i++) {
        this.slotDayOff[o['dayOfWeek']-1][i] = 'isDayOff';}
    });
    console.log('slotDayOff', this.slotDayOff);
  }
  // temp change part
  refactorTempChange() {
    for(let tempChange of this.teacherAvailableData.Data.TempChange) {
      // convert begin time to y
      let TimeBeginToArr = tempChange.TimeBegin.split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes-480)/15;
      // convert end time to y
      let TimeEndToArr = tempChange.TimeEnd.split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes-480)/15;
      // redefine arranged data from server
      this.tempChangeXYobj = {};
      this.tempChangeXYobj['dayOfWeek'] = tempChange.DayOfWeek;
      this.tempChangeXYobj['beginY'] = beginMinutesToY;
      this.tempChangeXYobj['endY'] = endMinutesToY;
      this.tempChangeXYobj['learnerName'] = tempChange.LearnerName;
      this.tempChangeXYarr.push(this.tempChangeXYobj);
    }
    console.log('tempChangeXYarr', this.tempChangeXYarr);
  }
  renderTempChange() {
    this.tempChangeXYarr.map((o, i) => {
      this.slotTempChangeLearnerName[o['dayOfWeek']-1][o['beginY']] = [o['learnerName']];
      for(let i = o['beginY']; i < o['endY']+1; i++) {
        this.slotTempChange[o['dayOfWeek']-1][i] = 'isTempChange';}
    });
    console.log('slotTempChange', this.slotTempChange);
  }
    // console.log('BeginY endY', this.beginMinutesToY, this.endMinutesToY);
  //   for(let arrangedXYobj of this.arrangedXYarr) {
  //     this.slotArrangedLearnerName[arrangedXYobj['dayOfWeek']-1][arrangedXYobj.beginY] = arrangedXYobj['learnerName'];
  //     for(let i = arrangedXYobj['beginY']; i < arrangedXYobj['endY']+1; i++) {
  //       this.slotArranged[arrangedXYobj['dayOfWeek']-1][i] = true;
  //       // this.slotArranged[arrangedXYobj['dayOfWeek']-1][arrangedXYobj.beginY] = true;
  //     }
  //   }
  //   console.log('arranded learner name', this.slotArrangedLearnerName);
  //   console.log('slot arranged', this.slotArranged)
  //   console.log('arrangedXYarr', this.arrangedXYarr);
  // }

  clickSlot(x: number, y: number) {
    // console.log('slot y', [x,y]);
    // this.clickXY.push([x,y]);
    // console.log('click xy', this.clickXY)
    // this.slotEvent[x][y] = !this.slotEvent[x][y];
  }
//   clearSlot() {
//     // this.clickXY.map((arr, i) => this.slotEvent[arr[0]][arr[1]] = false);
//   }
//   confirmSlot() {
//     // delete after test
//     this.clickXY.map((arr, i) => {
//       let tempArr = [];
//       // this.confirmTime = this.slotTime[arr[0]][arr[1]];
//       tempArr.push(this.slotTime[arr[0]][arr[1]]);
//       this.confirmTime = tempArr;
//       // console.log('sss', tempArr)
//       // console.log('aaa', this.confirmTime);
//     });
//     // console.log('aaa', this.confirmTime);
//   }
}
