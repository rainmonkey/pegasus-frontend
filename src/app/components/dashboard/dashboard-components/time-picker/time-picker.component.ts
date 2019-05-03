import { Component, OnInit } from '@angular/core';
import { TimeDetail } from '../../../../models/TimeDetail';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  public timeDetail: TimeDetail;
  

  constructor() { 
  }

  ngOnInit() {
    
    
  }

}
