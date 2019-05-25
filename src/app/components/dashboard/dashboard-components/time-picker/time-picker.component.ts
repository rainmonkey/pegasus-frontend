import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  // will delete data will from server, now just hard core
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
                        "OrgName": "MOUNT ROSKILL BRANCH"
                    },
                    {
                        "OrgId": 1,
                        "OrgName": "MOUNT ALBERT BRANCH"
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
  public duration: number = 2;

  // define day(x) and slot(y)
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex: number[]= [0, 1, 2, 3, 4, 5, 6];
  public yIndex: number[] = [];
  // define slot 
  public slot: any[] = [];
  public slotAvailable: any[] = [];
  public slotOrg: any[] = [];
  public slotTime: any[] = [];
  // redefine arranged
  public arrangedArr: any[] = [];
  // redefine day off
  public dayOffArr: any[] = [];
  // redefine temp change
  public tempChangeArr: any[] = [];
  // define learner name for rendering in HTML
  public learnerName: any[] = [];

  // undefine
  public orgName: string;

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
      this.slotAvailable[i] = [];
      this.learnerName[i] = [];
      this.slotOrg[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slot[i][j] = null;
        this.slotAvailable[i][j] = null;
        this.learnerName[i][j] = null;
        this.slotOrg[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
      }
    }
    console.log('slot time', this.slotTime);
    // manipulate by order
    this.setSpecificTime();
    this.renderAvailableDay();
    this.renderSlotProp();
    // this.callOneHourUnableToPick();
  }

///////////////////////////////////// Here are reusable functions////////////////////////////////////////
  /* 
    convert begin time and end time to yIndex
    and then refactor a new arr
  */
  transferTime(originalArr: any[]) {
    let arr = [];
    for(let data of originalArr) {
      // convert begin time to yIndex
      let TimeBeginToArr = data.TimeBegin.split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes-480)/15;
      // convert end time to yIndex
      let TimeEndToArr = data.TimeEnd.split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes-480)/15;
      // refactor a new arr
      let obj = {};
      obj['DayOfWeek'] = data.DayOfWeek;
      obj['BeginY'] = beginMinutesToY;
      obj['EndY'] = endMinutesToY;
      obj['LearnerName'] = data.LearnerName;
      arr.push(obj);  
    };
    return arr;
  }
  /*
    define every slot's property value for rendering in HTML
  */
  defineSlotProp(originalArr: any[], prop: string) {
    for(let o of originalArr) {
      let xIndex = o['DayOfWeek']-1;
      this.learnerName[xIndex][o['BeginY']] = o['LearnerName'];
      for(let i = o['BeginY']; i < o['EndY']+1; i++) {
        this.slot[xIndex][i] = prop;
      }
    }; 
    return this.learnerName, this.slot;
  }
  /*
    if teacher's available day is in different orgs
    when u pick up the available duration
    there should be one hour for teacher driving to another org 
  */
  oneHourUnableToPick(originalArr: any[], prop: string) {
    let xIndex: number;
    for(let o of originalArr) {
      xIndex = o['DayOfWeek']-1;
      for(let i = o['BeginY']-4; i < o['EndY']+5; i++) {
        this.slotAvailable[xIndex][i] = prop;
      }
    };
    return this.slotAvailable;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////

  /*
    call back transferTime function
    convert original array to new array handy to manipulate
  */
  setSpecificTime() {
    this.arrangedArr = this.transferTime(this.teacherAvailableData.Data.Arranged);
    this.dayOffArr = this.transferTime(this.teacherAvailableData.Data.Dayoff);
    this.tempChangeArr = this.transferTime(this.teacherAvailableData.Data.TempChange);
    // will delete 
    console.log('arrangedArr', this.arrangedArr);
    console.log('dayOffArr', this.dayOffArr);
    console.log('tempChangeArr', this.tempChangeArr);
  }
  /*
    define slot property value for ngClass in HTML
  */
  renderAvailableDay() {
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      // this.orgName = o.Orgs;
      // o.Orgs.map((o) => {
      //   this.orgName = o.OrgName;
      // })
      let xIndex = o['DayOfWeek']-1;
      for(let i = 0; i < 49; i++) {
        this.slot[xIndex][i] = 'isAvailableDay';
        this.slotOrg[xIndex][i] = o.Orgs;
      };
    });
    console.log('org', this.slotOrg);
  }
  /*
    call back defineSlotProp function for ngClass in HTML
  */
  renderSlotProp() {
    this.defineSlotProp(this.arrangedArr, 'isArranged');
    this.defineSlotProp(this.dayOffArr, 'isDayOff');
    this.defineSlotProp(this.tempChangeArr, 'isTempChange');
  }

  // callOneHourUnableToPick () {
  //   this.oneHourUnableToPick(this.arrangedArr, 'unableToPick');
  // }
  mouseoverSlot(x: number, y: number) {
    let xIndex: number;
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      xIndex = o.DayOfWeek-1;
      if(x == xIndex) {
        // console.log('y', y);
        if(this.slotOrg[xIndex][y].length > 0) {
          console.log('hhh')
        }
        this.oneHourUnableToPick(this.arrangedArr, 'unableToPick');
        // if 0 <= y < 48 
        if(y >= 0 && y < 48) {
          if(this.slotAvailable[xIndex][y] == 'unableToPick') {
            this.slotAvailable[xIndex][y] = 'unableToPick';
            // this.slotAvailable[xIndex][y-this.duration] = "isAvailable";
          } else if(
            this.slotAvailable[xIndex][y+1] == 'unableToPick' || this.slotAvailable[xIndex][y+2] == 'unableToPick'
            ) {
            this.slotAvailable[xIndex][y+1] == 'unableToPick';
            this.slotAvailable[xIndex][y+2] == 'unableToPick';
            }
          else {
            this.slotAvailable[xIndex][y] = 'isAvailable';
            this.slotAvailable[xIndex][y+1] = 'isAvailable';
            this.slotAvailable[xIndex][y+this.duration] = 'isAvailable';
          }
        }
        // else y = 48
        else if(y = 48) {
          this.slotAvailable[xIndex][y] = 'isAvailable';
          this.slotAvailable[xIndex][y-1] = 'isAvailable';
          this.slotAvailable[xIndex][y-this.duration] = "isAvailable";
        }
      }
    });
    // console.log('org', this.orgName); 
  }
  mouseoutSlot() {
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      let xIndex: number;
      xIndex = o.DayOfWeek-1;
      for(let i = 0; i < 49; i++) {
        this.slotAvailable[xIndex][i] = null;
      }
    });
  }

}


