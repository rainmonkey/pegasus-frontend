import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TimePickerService } from 'src/app/services/http/time-picker.service';

@Component({
  selector: 'app-time-picker-org',
  templateUrl: './time-picker-org.component.html',
  styleUrls: ['./time-picker-org.component.css']
})
export class TimePickerOrgComponent implements OnInit {
  // get data form one-on-one course of learner-registration-form 
  // @Input() command;
  @Input() course;
  @Input() orgId;
  @Input() startDate;
  @Input() dayOfWeek;
  // transmit begin time picked by user from time-picker to learner-registration-form
  @Output() beginTime = new EventEmitter<any>();

  // loading
  public loadingFlag: boolean = false;
  // properties for rendering in HTML
  // public weekdays2 = ['1','2','3','4','5','6','7'];
//   public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  public hours = [7,8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22,23];
  //public xIndex: number[] = [];
  public yIndex: number[] = [];
  public startTimeToEndTime: string;

  // define every slot's property
  public slot: any[] = [];
  public slotTime: any[] = [];
  public learnerName: any[] = [];

  // assign data to local props from @Input


  public duration: number;

  // assign prop for getting data from server as parms
  public teacherId: number;
  // public startDate: any;

  // prop will be output to parent component (learner-registration-form)
  public startTime: any;

  // assign data to local props from TeacherAvailableCheck API
  public arrangedArr: any[] = [];
  public dayOffArr: any[] = [];
  public tempChangeArr: any[] = [];
  public availableDayArr: any[];
  public errorMessage: string;

  public dayofweek: any;
  private slotYCount:number=68; //from 7 AM to 24PM ,1 hour have 4 slots
  private beginSlotPos = 420; //
  public teachers:any[]=[];

  constructor(private timePickerService: TimePickerService) {
  }
  getTeachersByOrg(){
    this.course= {CourseId:1,Duration:1};
    this.timePickerService.getTeacherByOrg(this.orgId,this.dayOfWeek).subscribe(
      res =>{
        this.teachers = res['Data'];
        this.setxIndex();
      },
      err =>{
        alert(`Server error:${err}!`);
      }
    )
  }
  setxIndex(){
    // this.xIndex = this.teachers;

    // for (let i = 0; i < this.teachers.length; i++) {
    //   this.xIndex.push(i);
    // }      
    for (let i = 0; i < this.slotYCount; i++) {
      this.yIndex.push(i);
    }  
  }
  ngOnInit() {
    this.loadingFlag = true;
    this.getTeachersByOrg();


     this.duration = this.course.Duration;
  
    // this.getTeacherAvailable();
  }

  renderTable(Data){
    let slotXCount = Data.length;
    for (let i = 0; i < this.slotYCount; i++) {
      this.yIndex.push(i);
    }
    // define property of slot
    for (let i = 0; i < slotXCount; i++) {
      this.slot[i] = [];
      this.learnerName[i] = [];
      this.slotTime[i] = [];
      for (let j = 0; j < this.slotYCount; j++) {
        this.slot[i][j] = null;
        this.learnerName[i][j] = null;
        this.slotTime[i][j] = `${Math.floor((this.beginSlotPos + j * 15) / 60)} 
          : ${(j * 15) % 60 == 0 ? '00' : ( j * 15) % 60}`;
      }
    }
  }
  /* get teacher available data from TeacherAvailableCheck API in timePickerService */
  getTeacherAvailable() {
    this.timePickerService.getTeacherAvailableCheck(this.teacherId, this.startDate).subscribe(
      (res) => {
        console.log('TeacherAvailableData', res.Data);
        this.renderTable(res.Data);
        this.setSpecificTime(res.Data);
        this.renderAvailableDay();
        this.renderSlotProp();
        this.loadingFlag = false;
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


  ///////////////////////////////////// get and reconstruct data from server//////////////////////////////////
  /*
    convert begin time and end time to the number of y
    and then reconstruct a new arr from TeacherAvailableCheck API 
  */
  transferTime(originalArr: any[]) {
    let arr = [];
    for (let data of originalArr) {
      // convert begin time to the number of y
      let TimeBeginToArr = data.TimeBegin.slice(11, 19).split(':');
      let TimeBeginToMinutes = (+TimeBeginToArr[0]) * 60 + (+TimeBeginToArr[1]);
      let beginMinutesToY = (+TimeBeginToMinutes - this.beginSlotPos) / 15;
      // convert end time to the number of y
      let TimeEndToArr = data.TimeEnd.slice(11, 19).split(':');
      let TimeEndToMinutes = (+TimeEndToArr[0]) * 60 + (+TimeEndToArr[1]);
      let endMinutesToY = (TimeEndToMinutes - this.beginSlotPos) / 15;
      // reconstruct a new arr
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
    callback transferTime function
    convert original data of array to new array for handy to manipulate
    and get teacher available day from server
  */
  setSpecificTime(teacherData: any) {
    this.arrangedArr = this.transferTime(teacherData.Arranged);
    this.dayOffArr = this.transferTime(teacherData.Dayoff);
    this.tempChangeArr = this.transferTime(teacherData.TempChange);
    this.availableDayArr = teacherData.AvailableDay;
  }

  /////////////////////////////////// render server data in HTML/////////////////////////////////////////////////////////
  /* 
    define teacher's Available day for rendering in HTML 
  */
  renderAvailableDay() {
    this.availableDayArr.map((o) => {
      let xIndex = o['DayOfWeek'] - 1;
      for (let i = 0; i < this.slotYCount; i++) {
        this.slot[xIndex][i] = 'isAvailable';
      };
    });
  }
  /* 
    define teacher's other data (Arranged,Dayoff,TempChange) from server for rendering in HTML 
  */
  defineSlotProp(originalArr: any[], prop: string) {
    for (let o of originalArr) {
      let xIndex = o['DayOfWeek'] - 1;
      this.learnerName[xIndex][o['BeginY']] = o['LearnerName'];
      for (let i = o['BeginY']; i < o['EndY']; i++) {
        this.slot[xIndex][i] = prop;
      }
    };
    return this.slot;
  }
  /* 
    callback defineSlotProp function for ngClass in HTML 
  */
  renderSlotProp() {
    this.defineSlotProp(this.arrangedArr, 'isArranged');
    this.defineSlotProp(this.dayOffArr, 'isDayOff');
    this.defineSlotProp(this.tempChangeArr, 'isTempChange');
  }

  ///////////////////////////////// event triggered in HTML /////////////////////////////////////////////////////////////
  mouseover(x: number, y: number) {
    this.availableDayArr.map((availableObj) => {
      if (this.dayofweek !== undefined) {
        let availableX = this.dayofweek - 1;
        if (x == availableX) {
          this.checkTeacherOrg(x, y, availableObj, availableX);
        }
      }
      else {
        let availableX = availableObj['DayOfWeek'] - 1;
        if (x == availableX) {
          this.checkTeacherOrg(x, y, availableObj, availableX);
        }
      }
    })
    // this.tempChangeIsAbleToPick(x, y);
  }
  mouseout(x: number, y: number) {
    this.availableDayArr.map((o) => {
      let xIndex = o['DayOfWeek'] - 1;
      for (let i = 0; i < this.slotYCount; i++) {
        if (this.slot[xIndex][i] == "ableToPick") {
          this.slot[xIndex][i] = "isAvailable";
        }
      }
    });
    this.tempChangeArr.map((o) => {
      let xIndex = o['DayOfWeek'] - 1;
      for (let i = 0; i < this.slotYCount; i++) {
        if (this.slot[xIndex][i] == "ableToPick") {
          this.slot[xIndex][i] = "isTempChange"
        }
      }
    })
  }
  confirm(x: number, y: number) {
    let outputObj = {};
    outputObj['BeginTime'] = this.startTime;
    // outputObj['Index'] = this.teaList[2]; 
    outputObj['TeacherId'] = this.teachers[x];
    this.beginTime.emit(outputObj);
  }
  ////////////////////////////// check if teacher's org includes learner's org/////////////////////////////////
  checkTeacherOrg(x: number, y: number, availableObj, availableX) {
    let availableOrgId = availableObj.Orgs.map((o) => o.OrgId);
    /* 判断 availableDay org 是否包含 learner org */
    // availableDay org includes learner org
    if (availableOrgId.includes(this.orgId)) {
      /* 判断 available org 是否有 arranged */
      this.checkAvailableHasArranged(x, y, availableObj, availableX);
    }
  }
  checkAvailableHasArranged(x: number, y: number, availableObj, availableX) {
    if (this.arrangedArr.length != 0) {
      this.arrangedArr.map((arrangedObj) => {
        let arrangedX = arrangedObj['DayOfWeek'] - 1;
        // if availableDay has arranged
        if (arrangedX == availableX) {
          /* 判断 arranged org 是否等于 learner org */
          this.checkArrangedOrg(x, y, arrangedObj);
        }
        else {
          this.setDuration('isAvailable', 'ableToPick', x, y)
        }
      })
    }
    else {
      this.setDuration('isAvailable', 'ableToPick', x, y);
    }
  }
  checkArrangedOrg(x: number, y: number, arrangedObj) {
    let arrangedOrgId = arrangedObj['OrgId'];
    if (arrangedOrgId==undefined) return;
    if ((arrangedOrgId == this.orgId)) {
      // arranged 前后可选
      this.setDuration('isAvailable', 'ableToPick', x, y)
    } else {
      // arranged 前后一小时不能选
      console.log(arrangedOrgId,this.orgId);
      this.aroundArrangedCanNotPick();
      this.setDuration('isAvailable', 'ableToPick', x, y)
    }
  }
  aroundArrangedCanNotPick() {
    this.arrangedArr.map((o) => {
      let xIndex = o['DayOfWeek'] - 1;
      for (let i = o['BeginY'] - 4; i < o['EndY'] + 5; i++) {
        if (this.slot[xIndex][i] != "isArranged") {
          this.slot[xIndex][i] = "oneHourUnableTopick";
        }
      }
    })
  }

  //////////////////////////////////// deal with tempChangeArr //////////////////////////////////////////////////
  /* 
    check if temp change >= duration
  */
  checkTempChange(x: number, y: number) {
    this.tempChangeArr.map((o) => {
      let gap = o.EndY - o.BeginY;
      if (gap + 1 < this.duration) {
        return false
      }
    });
    return true;
  }
  /* 
  if temp change >= duration, 
  then tempChangeArr is able to pick 
  */
  tempChangeIsAbleToPick(x: number, y: number) {
    this.tempChangeArr.map((o) => {
      let xIndex = o.DayOfWeek - 1
      if (this.checkTempChange(x, y) && x == xIndex && this.slot[x][y] == "isTempChange") {
        this.setDuration('isTempChange', 'ableToPick', x, y);
      }
    })
  }

  /////////////////////// check if has next duration and former duration  /////////////////////////////////////
  hasNextDuration(isAvailable: string, x: number, y: number) {
    for (let i = 0; i < this.duration + 1; i++) {
      if (this.slot[x][y + i] != isAvailable) {
        return false;
      }
    };
    return true;
  }
  getBottomY(isAvailable: string, ableToPick: string, x: number, y: number) {
    for (let i = 0; i < this.duration + 1; i++) {
      if (y != 0 && this.slot[x][y + i] != isAvailable && this.slot[x][y + i] != ableToPick) {
        return y + i - 1;
      }
    }
  }
  hasFormerDuration(isAvailable: string, ableToPick: string, x: number, y: number) {
    let bottomY = this.getBottomY(isAvailable, ableToPick, x, y);
    for (let i = 0; i < this.duration + 1; i++) {
      if (this.slot[x][bottomY - i] != isAvailable) {
        return false;
      }
    };
    return true;
  }
  setDuration(isAvailable: string, ableToPick: string, x: number, y: number) {
    if (this.hasNextDuration(isAvailable, x, y)) {
      for (let i = 0; i < this.duration + 1; i++) {
        this.slot[x][y + i] = ableToPick;
        this.startTime = `${this.slotTime[x][y]}`;
        this.startTimeToEndTime = `${this.slotTime[x][y]}-${this.slotTime[x][y + this.duration + 1]}`;
      };
    } else if (this.hasFormerDuration(isAvailable, ableToPick, x, y)) {
      let bottomY = this.getBottomY(isAvailable, ableToPick, x, y);
      for (let i = 0; i < this.duration + 1; i++) {
        this.slot[x][bottomY - i] = ableToPick;
      };
    }
  }
 
}
//test


