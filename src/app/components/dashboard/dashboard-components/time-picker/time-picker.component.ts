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
  // define slot 
  public slot: any[] = [];
  public slotTime: any[] = [];
  // redefine arranged
  public arrangedArr: any[] = [];
  public slotArrangedLearnerName: any[] = [];
  // redefine day off
  public dayOffArr: any[] = [];
  public slotDayOffLearnerName: any[] = [];
  // redefine temp change
  public tempChangeArr: any[] = [];
  public slotTempChangeLearnerName: any[] = [];

  constructor(private timePickerService: TimePickerService) {
  }

  ngOnInit() {
    // define yIndex
    for(let i = 0; i < 49; i++) {
      this.yIndex.push(i);
    }
    // define five type of slots 
    for (let i = 0; i < 7; i++) {
      this.slot[i] = [];
      this.slotArrangedLearnerName[i] = [];
      this.slotDayOffLearnerName[i] = [];
      this.slotTempChangeLearnerName[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slot[i][j] = null;
        this.slotArrangedLearnerName[i][j] = null;
        this.slotDayOffLearnerName[i][j] = null;
        this.slotTempChangeLearnerName[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
      }
    }
    console.log('slot time', this.slotTime);
    // manipulate by order, super important
    this.setSpecificTime();
    this.renderAvailableDay();
    this.renderArranged();
    this.renderDayOff();
    this.renderTempChange();
  }

/////////////////////////////// reusable function ////////////////////////////////////////
  transferTime(originTime) {
    let arr = [];
    for(let data of originTime) {
      // convert begin time to y
      let TimeBeginToArr = data.TimeBegin.split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes-480)/15;
      // convert end time to y
      let TimeEndToArr = data.TimeEnd.split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes-480)/15;
      // redefine arranged data from server
      let obj = {};
      obj['DayOfWeek'] = data.DayOfWeek;
      obj['BeginY'] = beginMinutesToY;
      obj['EndY'] = endMinutesToY;
      obj['LearnerName'] = data.LearnerName;
      arr.push(obj);  
    };
    return arr;
  }
///////////////////////////////////////////////////////////////////////////////////////////
  setSpecificTime() {
    this.arrangedArr = this.transferTime(this.teacherAvailableData.Data.Arranged);
    this.dayOffArr = this.transferTime(this.teacherAvailableData.Data.Dayoff);
    this.tempChangeArr = this.transferTime(this.teacherAvailableData.Data.TempChange);
    console.log('arrangedArr', this.arrangedArr);
    console.log('dayOffArr', this.dayOffArr);
    console.log('tempChangeArr', this.tempChangeArr);
  }
  renderAvailableDay() {
    this.teacherAvailableData.Data.AvailableDay.map((o, i) => {
      for(let i = 0; i < 49; i++) {
        this.slot[o['DayOfWeek']-1][i] = 'isAvailable';
      };
    });
  }
  renderArranged() {
    this.arrangedArr.map((o) => {
      this.slotArrangedLearnerName[o['DayOfWeek']-1][o['BeginY']] = [o['LearnerName']];
      for(let i = o['BeginY']; i < o['EndY']+1; i++) {
        this.slot[o['DayOfWeek']-1][i] = 'isArranged';}
    });
  }
  renderDayOff() {
    this.dayOffArr.map((o) => {
      this.slotDayOffLearnerName[o['DayOfWeek']-1][o['BeginY']] = [o['LearnerName']];
      for(let i = o['BeginY']; i < o['EndY']+1; i++) {
        this.slot[o['DayOfWeek']-1][i] = 'isDayOff';}
    });
  }
  renderTempChange() {
    this.tempChangeArr.map((o) => {
      this.slotTempChangeLearnerName[o['DayOfWeek']-1][o['BeginY']] = [o['LearnerName']];
      for(let i = o['BeginY']; i < o['EndY']+1; i++) {
        this.slot[o['DayOfWeek']-1][i] = 'isTempChange';}
    });
    console.log('slot', this.slot);
  }
  
    // console.log('BeginY EndY', this.beginMinutesToY, this.endMinutesToY);
  //   for(let arrangedXYobj of this.arrangedXYarr) {
  //     this.slotArrangedLearnerName[arrangedXYobj['DayOfWeek']-1][arrangedXYobj.BeginY] = arrangedXYobj['LearnerName'];
  //     for(let i = arrangedXYobj['BeginY']; i < arrangedXYobj['EndY']+1; i++) {
  //       this.slotArranged[arrangedXYobj['DayOfWeek']-1][i] = true;
  //       // this.slotArranged[arrangedXYobj['DayOfWeek']-1][arrangedXYobj.BeginY] = true;
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
