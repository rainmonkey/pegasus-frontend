import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  // public hours: number[] = [08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  public hours: [08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  constructor() { 
  }

  ngOnInit() {
   
  }

}
