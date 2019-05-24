import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
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

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    console.log(this.customCourse)

    // define yIndex
    for(let i = 0; i < 48; i++) {
      this.yIndex.push(i);
    }
    // define displayArray
    for (let i = 0; i < 7; i++) {
      this.displayArray[i] = [];
      this.textArray[i] = [];
      this.timeArray[i] = [];
      this.realTimeArray[i] = [];
      for (let j = 0; j < 48; j++) {
        this.timeArray[i][j] = j;
        this.displayArray[i][j] = false;
        this.textArray[i][j] = false;
        this.realTimeArray[i][j] = `${Math.floor((480 + j*15)/60)} : ${(480 + j*15)%60 == 0? '00' : (480 + j*15)%60}`;
      }
    }
    console.log('ss', this.realTimeArray)
    // this.startTotalMinutes = 480 + this.timeArray[0][0]*15;
    // console.log('sssss', this.startTotalMinutes)
    // this.endTotalMinutes = 480 + (y+1)*15;
    // this.startHour = Math.floor(this.startTotalMinutes/60);
    // this.startMinutes = this.startTotalMinutes%60 == 0 ? '00' : this.startTotalMinutes%60;
    // this.startTime = this.startHour + ":" + this.startMinutes;
    // this.endHour = Math.floor(this.endTotalMinutes/60 );
    // this.endMinutes = this.endTotalMinutes%60 == 0 ? '00' : this.endTotalMinutes%60;
    // this.endTime = this.endHour + ":" + this.endMinutes;
    // console.log('time:', this.startTime, this.endTime);
  }

  mousedown(x: number, y: number, event: any) {
    // event.stopPropagation();
    // this.tempXY['x'] = x;
    // this.tempXY['y'] = y;
    console.log('y', y);
    // this.displayArray[x][y] = false;
    // this.startTotalMinutes = 480 + y*15;
    this.textArray[x][y] = !this.textArray[x][y];
  }

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
  }

  sendMessageToParent() {
    // this.selectedY
    this.selectedY = this.realTimeArray[this.tempXY['x']][this.tempXY['y']];
    // this.messageToEmit.emit(this.selectedY)
    // this.messageToSendP = this.selectedY;
    console.log('fff',this.selectedY);
  }
}
