<<<<<<< HEAD
import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter, Input } from '@angular/core';
=======
import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';

>>>>>>> 26b55774662ec256d4d196c5ff8c5cc20ca58d23

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
<<<<<<< HEAD
  // component interact from learner rigistration form
  @Input() customCourse;


  // @Output() messageToEmit = new EventEmitter<any>();
  // messageToSendP: any;
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex = [0, 1, 2, 3, 4, 5, 6];
  public yIndex = [];
  public displayArray = [];
  public timeArray = [];
  public textArray = [];
  public selectedY: number;
  public eventTrigger : boolean = false;
  public styleObject = {};
  public tempXY = {};
  public slotBottom = [3,7,11,15,19,23,27,31,35,39,43,47];
  public startTotalMinutes: any;
  public endTotalMinutes: any;
  public startHour: any;
  public endHour: any;
  public startMinutes: any;
  public endMinutes: any;
  public startTime: any;
  public endTime: any;
  public showTime: boolean = false;
  public realTimeArray: any[] = [];
  public selectTime: any;
=======
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
  public duration: number = 1;

  // define day(x) and slot(y)
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex: number[]= [0, 1, 2, 3, 4, 5, 6];
  public yIndex: number[] = [];
  // define slot 
  public slot: any[] = [];
  public slotAvailable: any[] = [];
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
>>>>>>> 26b55774662ec256d4d196c5ff8c5cc20ca58d23

  public learnerName: any[] = [];
  constructor(private timePickerService: TimePickerService) {
  }

  ngOnInit() {
    console.log(this.customCourse)

    // define yIndex
    for(let i = 0; i < 49; i++) {
      this.yIndex.push(i);
    }
    // define five type of slots 
    for (let i = 0; i < 7; i++) {
      this.slot[i] = [];
      this.slotAvailable[i] = [];
      this.learnerName[i] = [];
      this.slotArrangedLearnerName[i] = [];
      this.slotDayOffLearnerName[i] = [];
      this.slotTempChangeLearnerName[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slot[i][j] = null;
        this.slotAvailable[i][j] = null;
        this.learnerName[i][j] = null;
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
    this.renderSlotProp();
    // this.defineSlotProp();
    // this.renderArranged();
    // this.renderDayOff();
    // this.renderTempChange();
  }

/////////////////////////////// reusable function ////////////////////////////////////////
  transferTime(originTime: any[]) {
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
<<<<<<< HEAD

  mouseup(x: number, y: number, event: any) {
    // this.displayArray[x][y] = !this.displayArray[x][y];
    // let tempRange = y - this.tempXY['y'];
    // console.log('tempRange', tempRange)
    // this.selectedY = y;
    this.tempXY['x'] = x;
    this.tempXY['y'] = y;
    for(let i = this.tempXY['y']; i < y+1; i++) {
      this.displayArray[x][i] = !this.displayArray[x][i];
      // console.log('displayArray1', this.displayArray)
    }
    // console.log('mouseup', this.displayArray);
    // update time label
    // this.startTotalMinutes = 480 + this.tempXY['y']*15;
    // this.endTotalMinutes = 480 + (y+1)*15;
    // this.startHour = Math.floor(this.startTotalMinutes/60);
    // this.startMinutes = this.startTotalMinutes%60 == 0 ? '00' : this.startTotalMinutes%60;
    // this.startTime = this.startHour + ":" + this.startMinutes;
    // this.endHour = Math.floor(this.endTotalMinutes/60 );
    // this.endMinutes = this.endTotalMinutes%60 == 0 ? '00' : this.endTotalMinutes%60;
    // this.endTime = this.endHour + ":" + this.endMinutes;
    // console.log('time:', this.startTime, this.endTime);
=======
  defineSlotProp(arr: any[], prop: string) {
    for(let o of arr) {
      let xIndex = o['DayOfWeek']-1;
      this.learnerName[xIndex][o['BeginY']] = o['LearnerName'];
      for(let i = o['BeginY']; i < o['EndY']+1; i++) {
        this.slot[xIndex][i] = prop;
      }
    }; 
    return this.learnerName, this.slot;
>>>>>>> 26b55774662ec256d4d196c5ff8c5cc20ca58d23
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
/////////////////////////////////////// render part /////////////////////////////////////////////
  renderAvailableDay() {
    this.teacherAvailableData.Data.AvailableDay.map((o, i) => {
      for(let i = 0; i < 49; i++) {
        this.slot[o['DayOfWeek']-1][i] = 'isAvailableDay';
      };
    });
  }
  renderSlotProp() {
    this.defineSlotProp(this.arrangedArr, 'isArranged');
    this.defineSlotProp(this.dayOffArr, 'isDayOff');
    this.defineSlotProp(this.tempChangeArr, 'isTempChange');
  }
////////////////////////////////////// hover slot function ///////////////////////////
  mouseoverSlot(x: number, y: number) {
    let xIndex: number;
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      xIndex = o.DayOfWeek-1;
      if(x == xIndex) {
        // console.log('mouseover[x,y]', [x,y]);
        // if 0 <= y < 48
        if(y >= 0 && y < 48) {
          this.slotAvailable[xIndex][y] = 'isAvailable';
          this.slotAvailable[xIndex][y+this.duration] = "isAvailable";}
        // else y = 48
          else if(y = 48){
            this.slotAvailable[xIndex][y] = 'isAvailable';
            this.slotAvailable[xIndex][y-this.duration] = "isAvailable";}
            // else if(y = )
      };
    });
    // console.log('eeee', this.slotAvailable); 
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


