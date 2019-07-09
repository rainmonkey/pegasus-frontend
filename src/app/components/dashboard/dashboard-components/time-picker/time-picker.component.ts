import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  // get data form one-on-one course of learner-registration-form 
  @Input() customCourse;
  @Input() teaList;
  // transmit begin time picked by user from time-picker to learner-registration-form
  @Output() beginTime = new EventEmitter<any>();

  // properties for rendering in HTML
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex: number[]= [0, 1, 2, 3, 4, 5, 6];
  public yIndex: number[] = [];
  public startTimeToEndTime: string;

  // define every slot's property
  public slot: any[] = []; 
  public slotTime: any[] = [];
  public learnerName: any[] = [];

   // assign data to local props from @Input
   public duration: number;
   public learnerOrgId: number;
   public teacherName: string;

  // prop will be transmitted to parent component (learner-registration-form)
  public startTime: any;

  // assign data to local props from TeacherAvailableCheck API
  public arrangedArr: any[] = [];
  public dayOffArr: any[] = [];
  public tempChangeArr: any[] = [];
  public availableArr: any[];
  public errorMessage: string;

  constructor(private timePickerService: TimePickerService) {
  }

  ngOnInit() {
    console.log('customCourse', this.customCourse,'teacherArray',this.teaList);
    // define yIndex for rendering in HTML
    for(let i = 0; i < 48; i++) {
      this.yIndex.push(i);
    }
    // define property of slot
    for (let i = 0; i < 7; i++) {
      this.slot[i] = [];
      this.learnerName[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < 49; j++) {
        this.slot[i][j] = null;
        this.learnerName[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
      }
    }
    // get data from server 
    this.getTeacherAvailable();
  }

  /* get teacher available time from TeacherAvailableCheck API in timePickerService */
  getTeacherAvailable() {
    let teacherId = this.customCourse.teacherName;
    // console.log('teacher id', teacherId);
    let startDate = this.customCourse.beginDate;
    // console.log('start date', startDate);
    this.timePickerService.getTeacherAvailableCheck(Number(teacherId),startDate).subscribe(
      (res) => {
        console.log('TeacherData', res.Data)
        this.learnerOrgId = Number(this.customCourse.location);
        console.log('location', this.learnerOrgId)
        this.teacherName = this.customCourse.teacherName;
        this.duration = 3;
        // this.loadingFlag = false;
        this.setSpecificTime(res.Data);
        this.renderAvailableDay();
        this.renderSlotProp();
      },
      (err) => {
        this.backendErrorHandler(err);
      }
    );
  }
  backendErrorHandler(err) {
    console.warn(err);
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = "Error! Can't catch Data."
    }
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
  /*
    call back transferTime function
    convert original array to new array for handy to manipulate
  */
//  TODO:teacherData.Data WILL get from database
setSpecificTime(teacherData: any) {
  this.arrangedArr = this.transferTime(teacherData.Arranged);
  this.dayOffArr = this.transferTime(teacherData.Dayoff);
  this.tempChangeArr = this.transferTime(teacherData.TempChange);
  this.availableArr = teacherData.AvailableDay;
  console.log('teacher available day', this.availableArr)
}
//////////////////////////////////////////////////////////////////////////////////////////
 /* define slot property value for ngClass in HTML */
 renderAvailableDay() {
  this.availableArr.map((o) => {
    let xIndex = o['DayOfWeek']-1;
    // if(this.findTeahcerAvailableOrg) {
      for(let i = 0; i < 48; i++) {
        this.slot[xIndex][i] = 'isAvailable';
      };
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
    return this.slot;
  }
   /* call back defineSlotProp function for ngClass in HTML */
   renderSlotProp() {
    this.defineSlotProp(this.arrangedArr, 'isArranged');
    this.defineSlotProp(this.dayOffArr, 'isDayOff');
    this.defineSlotProp(this.tempChangeArr, 'isTempChange');
  }
////////////////////////////////////////////////////////////////////////////////////////////////
  /* 
     teacher's available day's orgId not inclueds learner's orgId
     so all teacher's available day can not be picked
   */
  teacherOrgNotIncludeslearnerOrgId(x) {
    for(let i = 0; i < 48; i++) {
      if(this.slot[x][i] == "ableToPick") {
        this.slot[x][i] = "tOrgNotIncludesLOrg";
      }
    }
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
        this.startTimeToEndTime = `${this.slotTime[x][y]}-${this.slotTime[x][y+3]}`;
        this.startTime = `${this.slotTime[x][y]}`;
      };
    } else if(this.hasFormerDuration(prop1,prop2,x,y)) {
      let bottomY=this.getBottomYindex(prop1,prop2,x,y);
      for(let i of [0,1,2,3]) {
        this.slot[x][bottomY-i] = prop2;
      };
    }
  }
  /* check if temp change >= duration */
  judgeTempChangeDuration(x,y) {
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
      if(this.judgeTempChangeDuration(x,y) && x == xIndex && this.slot[x][y] == "isTempChange") {
        this.setDuration('isTempChange','ableToPick',x,y);
      }
    })

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
    if(filterOrgIdArr[0] == this.learnerOrgId) {
      this.arrangedOrgEqualTolearnerOrgId(this.arrangedArr, x, y);
    } else {
      this.teacherOrgNotIncludeslearnerOrgId(x);
    }
  }
  teacherHasManyOrgs(filterOrgIdArr: any[], x, y) {
    // console.log('teacherHasManyOrgs1111', filterOrgIdArr)
    // console.log('teacher orgs includes learner org', this.learnerOrgId,filterOrgIdArr.includes(this.learnerOrgId));
    if(filterOrgIdArr.includes(this.learnerOrgId)) {
      // console.log('teacher orgs includes learner org', filterOrgIdArr.includes(this.learnerOrgId));
      this.arrangedOrgEqualTolearnerOrgId(this.arrangedArr, x, y);
      this.teacherOrgIncludeslearnerOrgId(this.availableArr, x, y);
    } else {
      this.teacherOrgNotIncludeslearnerOrgId(x);
    }
  }
  arrangedOrgEqualTolearnerOrgId(arrangedArr: any[], x, y) {
    let xIndex: number;
    arrangedArr.map((o) => {
      // console.log('arrangedarr', arrangedArr)
      xIndex = o.DayOfWeek - 1;
      //this.learnerOrgId.OrgId
      if(x == xIndex && o.OrgId == this.learnerOrgId) {
        this.setDuration('isAvailable','ableToPick',x,y);
        // console.log('aOrg == lOrg')
      } else if(x == xIndex) {
        this.oneHourUnableToPick(o,x,y);
        this.setDuration('isAvailable','ableToPick',x,y);
        // console.log('aOrg != lOrg')
      }
    })
  }
  teacherOrgIncludeslearnerOrgId(teacherArr,x,y) {
    let xIndex: number;
    teacherArr.map((o) => {
      xIndex = o.DayOfWeek - 1;
      if(x == xIndex) {
        this.setDuration('isAvailable', 'ableToPick',x,y);
      } 
    })
  }
  mouseoverSlot(x: number, y: number) {
    // console.log('mouse over')
    let xIndex: number;
    this.tempChangeIsAbleToPick(x,y);
    // console.log('mouseouver',x,this.availableArr)
    this.availableArr.map((o) => {
      xIndex = o.DayOfWeek-1;
      let filterOrgId = o.Orgs.map((o) => o.OrgId);
      // console.log('filerOrg', filterOrgId)
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
    this.availableArr.map((o) => {
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
  confirm() {
    console.log('confirm',this.startTime);
    this.beginTime.emit(this.startTime)
  }
}


