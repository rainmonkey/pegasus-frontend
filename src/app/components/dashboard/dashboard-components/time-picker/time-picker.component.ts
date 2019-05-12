import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  public weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public xIndex = [0, 1, 2, 3, 4, 5, 6];
  public yIndex = [];
  public timeArray = []; 
  public selectedY: number[] = [];
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
  

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    // define yIndex
    for(let i = 0; i < 48; i++) {
      this.yIndex.push(i);
    }
    // define timeArray
    for (let i = 0; i < 7; i++) {
      this.timeArray[i] = [];
      for (let j = 0; j < 48; j++) {
        this.timeArray[i][j] = false;
      }
    }
  }

  mousedown(x: number, y: number) {
    // event.stopPropagation();
    this.tempXY['x'] = x;
    this.tempXY['y'] = y;
    // this.timeArray[x][y] = !this.timeArray[x][y];
  }
   
  mouseup(x: number, y: number) {
    this.timeArray[x][y] = !this.timeArray[x][y];
    let tempRange = y - this.tempXY['y'];
    console.log('tempRange', tempRange)
    for(let i = this.tempXY['y']; i < y; i++) {
      this.timeArray[x][i] = !this.timeArray[x][i];
    }
    // update time label
    this.startTotalMinutes = 480 + this.tempXY['y']*15;
    this.endTotalMinutes = 480 + (y+1)*15;
    this.startHour = Math.floor(this.startTotalMinutes/60);
    this.startMinutes = this.startTotalMinutes%60 ==0 ? '00' : this.startTotalMinutes%60;
    this.startTime = this.startHour + ":" + this.startMinutes;
    this.endHour = Math.floor(this.endTotalMinutes/60 );
    this.endMinutes = this.endTotalMinutes%60 ==0 ? '00' : this.endTotalMinutes%60;
    this.endTime = this.endHour + ":" + this.endMinutes;
    console.log('time:', this.startTime, this.endTime)
  }

  checkASum() {
    console.log(this.selectedY);
  }
}
