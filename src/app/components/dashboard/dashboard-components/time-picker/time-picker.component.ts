import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  @ViewChild('slot') slotEl: ElementRef;

  public slots_per_hour: number = 4; //  60 / interval 
  public day: any;
  public slots: any;
  public slot: any;
  public slot_height: number = 10;
  public 
  public weekdays: Array<string> = ['Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
   
    let hour_labels = this.renderer.createElement('div');
    this.renderer.addClass(hour_labels,'rmws-hour-labels');
    for (let i = 8; i <= 19; i++) {
      let hour_label = this.renderer.createElement('div');
      this.renderer.addClass(hour_label, 'rmws-hour-label');
      let text = this.renderer.createText(`${i}:00`);
      this.renderer.appendChild(hour_label, text);
      this.renderer.appendChild(hour_labels, hour_label);
    }
    console.log('hour_labels', hour_labels);
  
    
    let days = this.renderer.createElement('div');
    this.renderer.addClass(days, 'rmws-days');
    for(let weekday of this.weekdays) {
      this.day = this.renderer.createElement('div');
      this.renderer.addClass(this.day, 'rmws-day');
      let day_label = this.renderer.createElement('div');
      this.renderer.addClass(day_label, 'rmws-day-label');
      let text = this.renderer.createText(`${weekday}`);
      this.renderer.appendChild(day_label, text);
      this.renderer.appendChild(this.day, day_label);

      this.slots = this.renderer.createElement('div');
      this.renderer.addClass(this.slots, 'rmws-slots');
      for(let i = 1; i <= 48; i++) {
        this.slot = this.renderer.createElement('div');
        this.renderer.addClass(this.slot, 'rmws-slot');
        this.renderer.appendChild(this.slots, this.slot);
      }
      this.renderer.appendChild(this.day, this.slots);
      this.renderer.appendChild(days, this.day);
    }
    console.log('days', days);

    let timePicker = this.renderer.createElement('div');
    this.renderer.addClass(timePicker, 'rmWeeklySchedule');
    this.renderer.appendChild(timePicker, hour_labels);
    this.renderer.appendChild(timePicker, days);

    this.renderer.appendChild(this.el.nativeElement, timePicker);

    this.renderer.listen(this.slots, 'mousedown', (event)=> {
      console.log('event', event);
      if((event.toElement).hasClass('rmws-event')){
        return;
      }
      return event;
    })

  }

}
