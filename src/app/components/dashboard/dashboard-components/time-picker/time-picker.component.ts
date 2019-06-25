import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  // get data form registration component
  @Input() customCourse;
  // data will from server, now just hard core for testing
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
                        "OrgId": 2,
                        "OrgName": "EPSOM BRANCH"
                    },
                    {
                        "OrgId": 3,
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
                "DayOfWeek": 3,
                "TimeBegin": "13:00:00",
                "TimeEnd": "14:00:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 2,
                "OrgId": 2,
                "OrgName": "MOUNT ALBERT BRANCH"
            },
            {
                "DayOfWeek": 3,
                "TimeBegin": "16:30:00",
                "TimeEnd": "17:30:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 17,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Oliver Deng",
                "CourseScheduleId": 18,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
            },
            {
                "DayOfWeek": 7,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "John Key",
                "CourseScheduleId": 19,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
            },
            {
                "DayOfWeek": 7,
                "TimeBegin": "15:15:00",
                "TimeEnd": "15:45:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 34,
                "OrgId": 2,
                "OrgName": "EPSOM BRANCH"
            },
            {
                "DayOfWeek": 7,
                "TimeBegin": "17:00:00",
                "TimeEnd": "17:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 35,
                "OrgId": 2,
                "OrgName": "EPSOM BRANCH"
            },
            {
                "DayOfWeek": 5,
                "TimeBegin": "14:00:00",
                "TimeEnd": "14:30:00",
                "LearnerName": "Mama Key",
                "CourseScheduleId": 36,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
            },
            {
                "DayOfWeek": 6,
                "TimeBegin": "13:00:00",
                "TimeEnd": "14:00:00",
                "LearnerName": "Group",
                "CourseScheduleId": 3,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
            },
            {
                "DayOfWeek": 2,
                "TimeBegin": "14:00:00",
                "TimeEnd": "15:00:00",
                "LearnerName": "Group",
                "CourseScheduleId": 4,
                "OrgId": 1,
                "OrgName": "CENTRAL AUCKLAND BRANCH"
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
  // modal test
  public testMyInput = 2;
  public name: string = 'Stella';
  public learnerOrg = {
    OrgId: 2,
    OrgName: "EPSOM BRANCH"
  }
  public duration: number = 3;

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
  // redefine day off
  public dayOffArr: any[] = [];
  // redefine temp change
  public tempChangeArr: any[] = [];
  // define learner name for rendering in HTML
  public learnerName: any[] = [];
  
  public slotPopover: any[] = [];
  public isTrigger: boolean = false;
  constructor(private timePickerService: TimePickerService) {
  }

  ngOnInit() {
    console.log('customCourse', this.customCourse);

    // define yIndex
    for(let i = 0; i < 48; i++) {
      this.yIndex.push(i);
    }
    // define type of slots
    for (let i = 0; i < 7; i++) {
      this.slot[i] = [];
      this.learnerName[i] = [];
      this.slotTime[i] = [];
      this.slotPopover[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slot[i][j] = null;
        this.learnerName[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
        this.slotPopover[i][j] = false;
      }
    }
    console.log('slot time', this.slotTime);

    // manipulate by order
    this.setSpecificTime();
    this.renderAvailableDay();
    this.renderSlotProp();
  }

  ////////////////// pop over ///////////////////////////
  hasNextAbleToPick(x,y){
    for(let i of [0,1,2,3]) {
      if(this.slot[x][y+i] != "ableToPick") {
        return false;
      }
    }; 
    return true;
  }
  getUnableToPickYindex(x,y) {
    for(let i of [0,1,2,3]) {
      if(this.slot[x][y+i] != "ableToPick") {
        return y+i-1;
      }
    }
  }
  hasFormerAbleToPick(x,y) {
    let bottomY = this.getUnableToPickYindex(x,y);
    for(let i of [0,1,2,3]) {
      if(this.slot[x][bottomY-i] != "ableToPick") {
        return false;
      }
    }; 
    return true;
  }
  // triggerPopover(p) {
  //   if(this.isTrigger) {
  //     p.close();
  //   } else {
  //     // setTimeout(() => {
  //     //   p.close();
  //     // }, 2000)
  //   }
  // }
  openPopover(p,x,y) {
    p.open();
    // this.isTrigger = false;
    // this.isTrigger = true;
    // this.triggerPopover(p);
  }
  closePopover(p,x,y) {
    p.close();
    // // this.isTrigger = true;
    // this.triggerPopover(p);
    // setTimeout(()=>{x
    //   p.close()
    // },20000)
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
      obj['OrgId'] = data.OrgId;
      arr.push(obj);
    };
    return arr;
  }
  teacherOrgNotIncludesLearnerOrg(x) {
    for(let i = 0; i < 48; i++) {
      if(this.slot[x][i] == "isAvailable") {
        this.slot[x][i] = "tOrgNotIncludesLorg";
      }
    }
  }
  /* whether one-on-one course org is in teacher available org*/
  orgIsAvailable(originalArr: any[]) {
    originalArr.map((obj) => {
      // console.log('weekday', obj.DayOfWeek);
      let orgIdArr = obj.Orgs.map((o) => o.OrgId);
      console.log('orgIdArr', orgIdArr)
      // if(orgIdArr.includes(this.learnerOrg.OrgId)) {
      //   console.log('weekday', obj.DayOfWeek);
      // }
    });
  }
  /* define every slot's property value for rendering in HTML */
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
  /* estimate if next duration and former duration is able to pick */
  hasNextDuration(prop1,x: number, y: number) {
    for(let i of [0,1,2,3]) {
      if(this.slot[x][y+i] != prop1) {
        return false;
      }
    };
    return true;
  }
  getBottomYindex(prop1,prop2,x,y) {
    for(let i of [0,1,2,3]) {
      if(y!=0 && this.slot[x][y+i] !=prop1 && this.slot[x][y+i] !=prop2) {
        return y+i-1;
      }
    }
  }
  hasFormerDuration(prop1,prop2,x: number, y: number) {
    let bottomY=this.getBottomYindex(prop1,prop2,x,y);
    for(let i of [0,1,2,3]) {
      if(this.slot[x][bottomY-i] != prop1) {
        return false;
      }
    };
    return true;
  }
  setDuration(prop1,prop2,x: number, y: number){
    if(this.hasNextDuration(prop1,x,y)) {
      for(let i of [0,1,2,3]) {
        this.slot[x][y+i] = prop2;
      };
    } else if(this.hasFormerDuration(prop1,prop2,x,y)) {
      let bottomY=this.getBottomYindex(prop1,prop2,x,y);
      for(let i of [0,1,2,3]) {
        this.slot[x][bottomY-i] = prop2;
      };
    } 
  }
  /* check if temp change >= duration */
  tempChangeInculdesDuration(x,y) {
  this.tempChangeArr.map((o) => {
    let gap = o.EndY - o.BeginY;
    if(gap < this.duration) {
      return false
    }
  });
  return true
}
 /* if temp change >= duration, then tempChangeArr is able to pick */
  tempChangeIsAbleToPick(x: number, y: number) {
    let xIndex: number;
    this.tempChangeArr.map((o) => {
      let gap = o.EndY - o.BeginY;
      xIndex = o.DayOfWeek-1
      if(this.tempChangeInculdesDuration(x,y) && x == xIndex && this.slot[x][y] == "isTempChange") {
        this.setDuration('isTempChange','ableToPick',x,y);
      }
    })
  
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
  /* define slot property value for ngClass in HTML */
  renderAvailableDay() {
    this.orgIsAvailable(this.teacherAvailableData.Data.AvailableDay);
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      let xIndex = o['DayOfWeek']-1;
      if(this.orgIsAvailable) {
        for(let i = 0; i < 48; i++) {
          this.slot[xIndex][i] = 'isAvailable';
        };
      } else {
        for(let i = 0; i < 48; i++) {
          this.slot[xIndex][i] = 'isAvailableButUnableToPick';
        }
      }
    });
  }
  /* call back defineSlotProp function for ngClass in HTML */
  renderSlotProp() {
    this.defineSlotProp(this.arrangedArr, 'isArranged');
    this.defineSlotProp(this.dayOffArr, 'isDayOff');
    this.defineSlotProp(this.tempChangeArr, 'isTempChange');
    // console.log('slot', this.slot);
  }
  oneHourUnableToPick(o, x, y) {
    for(let i = o['BeginY']-4; i < o['EndY']+5; i++) {
      if(this.slot[x][i] != "isArranged") {
        this.slot[x][i] = "oneHourUnableTopick";
      }
    }
  }
  teacherHasOneOrg(filterOrgIdArr: any[], x, y) {
    // console.log('teacherHasOneOrg')
    if(filterOrgIdArr[0] == this.learnerOrg.OrgId) {
      this.arrangedOrgEqualToLearnerOrg(this.arrangedArr, x, y);
    } else {
      this.teacherOrgNotIncludesLearnerOrg(x);
    }
  }
  teacherHasManyOrgs(filterOrgIdArr: any[], x, y) {
    // console.log('teacherHasManyOrgs')
    if(filterOrgIdArr.includes(this.learnerOrg.OrgId)) {
      // console.log('teacher orgs includes learner org');
      this.arrangedOrgEqualToLearnerOrg(this.arrangedArr, x, y);
    } else {
      this.teacherOrgNotIncludesLearnerOrg(x);
    }
  }
  arrangedOrgEqualToLearnerOrg(arrangedArr: any[], x, y) {
    let xIndex: number;
    arrangedArr.map((o) => {
      // console.log('arrangedarr', arrangedArr)
      xIndex = o.DayOfWeek - 1;
      //this.learnerOrg.OrgId
      if(x == xIndex && o.OrgId == this.learnerOrg.OrgId) {
        this.setDuration('isAvailable','ableToPick',x,y);
        // console.log('aOrg == lOrg')
      } else if(x == xIndex) {
        this.oneHourUnableToPick(o,x,y);
        this.setDuration('isAvailable','ableToPick',x,y);
        // console.log('aOrg != lOrg')
      }
    })
  }
  mouseoverSlot(x: number, y: number) {
    // console.log('mouse over')
    let xIndex: number;
    this.tempChangeIsAbleToPick(x,y);
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      xIndex = o.DayOfWeek-1;
      let filterOrgId = o.Orgs.map((o) => o.OrgId);
      if(x == xIndex && filterOrgId.length == 1) {
        // console.log('teacherHasOneOrg')
        this.teacherHasOneOrg(filterOrgId, x, y);
      } else if(x == xIndex && filterOrgId.length !=1) {
        // console.log('teacherHasManyOrgs')
        this.teacherHasManyOrgs(filterOrgId, x, y);
      }
    });
  }
  mouseoutSlot(x: number, y: number) {
    // console.log('mouse out')
    let xIndex: number;
    this.teacherAvailableData.Data.AvailableDay.map((o) => {
      xIndex = o.DayOfWeek-1;
        for(let i = 0; i < 48; i++) {
          if(this.slot[xIndex][i] == "ableToPick") {
            this.slot[xIndex][i] = "isAvailable";
          }
        }
    });
    this.tempChangeArr.map((o) => {
      for(let i = 0; i < 48; i++) {
        if(this.slot[x][i] == "ableToPick") {
          this.slot[x][i] = "isTempChange"
        }
      }
    })  
  }

}


