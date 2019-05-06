import { Component, OnInit } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
    // define yIndex
    for(let i = 0; i < 48; i++) {
      this.yIndex.push(i);
    }
    // define timeArray
    let myArr = [];
    for (let i = 0; i < 7; i++) {
      myArr[i] = [];
      for (let j = 0; j < 48; j++) {
        myArr[i][j] = false;
      }
    }
    this.timeArray = myArr;

  }
  onClick(x: number, y: number) {
    this.timeArray[x][y] = true;
    console.log('timeArrayIndex',[x,y]);
  }
}
