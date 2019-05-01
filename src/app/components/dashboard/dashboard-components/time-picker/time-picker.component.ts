import { Component, OnInit } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  public slots_per_hour: number = 4; //  60 / interval 
  public day: any;
  public slot_height: any;
  public weekdays: Array<string> = ['Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    
    let hour_labels = this.renderer.createElement('div');
    this.renderer.addClass(hour_labels,'rmw-hour-labels');
    for (let i = 8; i <= 20; i++) {
      let hour_label = this.renderer.createElement('div');
      this.renderer.addClass(hour_label, 'rmws-hour-label');
      let text = this.renderer.createText(`${i}:00`);
      this.renderer.appendChild(hour_label, text);
      this.renderer.appendChild(hour_labels, hour_label);
    }
    console.log('hour_labels', hour_labels);
    this.renderer.appendChild(this.el.nativeElement, hour_labels);
    
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
      let slots = this.renderer.createElement('div');
      this.renderer.addClass(slots, 'rmws-slots');
      for(let i = 1; i <= 96; i++) {
        let slot = this.renderer.createElement('div');
        this.renderer.addClass(slot, 'rmws-slot');
        this.renderer.appendChild(slots, slot);
      }
      this.renderer.appendChild(this.day, slots);
      this.renderer.appendChild(days, this.day);
    }
    console.log('days', days);
    this.renderer.appendChild(this.el.nativeElement, days);
}

  ngAfterViewInit() {
    this.slot_height = this.el.nativeElement.querySelector('.rmws-slot');
    console.log('sss', this.renderer);
  }
  // linkFunc = function(scope, element, attrs) {
  //   var $hour_labels, i, j, mousedown;
  //   slot_height = $('.rmws-slot').outerHeight(); // 10px
  //   console.log('rmws_slot outerHeight',  slot_height = $('.rmws-slot').outerHeight());
  //   $(".rmws-hour-label").height(slot_height * slots_per_hour); // 10px * 4 = 40px
  //   $(`.rmws-slot:nth-child(${slots_per_hour}n)`).css('border-bottom', '1px solid #d0d0d0');
  //   mousedown = {
  //     e: null,
  //     el: null
  //   };
  //   $('.rmws-slots').on('mousedown', function(e) {
  //     if ($(e.toElement).hasClass('rmws-event')) {
  //       return;
  //     }
  //     return mousedown.e = e;
  //   });
  //   $('.rmws-slots').on('mousemove', function(e) {
  //     var distance, height, offset;
  //     if (mousedown.el || move_action.el || resize_top_action.el || resize_bottom_action.el) {
  //       e.preventDefault();
  //     }
  //     if (resize_bottom_action.e) {
  //       resize_bottom(e);
  //       return;
  //     }
  //     if (resize_top_action.e) {
  //       resize_top(e);
  //       return;
  //     }
  //     if (move_action.e) {
  //       move(e);
  //       return;
  //     }
  //     if (!mousedown.e) {
  //       return;
  //     }
  //     e.preventDefault();
  //     if (!mousedown.el) {
  //       mousedown.el = $('<div></div>', {
  //         class: 'rmws-event',
  //         text: '80’s'
  //       });
  //       updateTimeLabel(mousedown.el);
  //       mousedown.el.append($('<div></div>', {
  //         class: 'rmws-close'
  //       }));
  //       mousedown.el.append($('<div></div>', {
  //         class: 'rmws-handle rmws-handle-top'
  //       }));
  //       mousedown.el.append($('<div></div>', {
  //         class: 'rmws-handle rmws-handle-bottom'
  //       }));
  //       mousedown.el.appendTo($(mousedown.e.target).parent());
  //     } 
  //     if ($(e.toElement).hasClass('rmws-event') && e.toElement !== mousedown.el[0]) {
  //       return;
  //     }
  //     distance = e.pageY - mousedown.e.pageY;
  //     if (distance < 0) {
  //       offset = Math.ceil((mousedown.e.pageY - $(this).offset().top + 1) / slot_height) * slot_height + 2;
  //       height = Math.floor(distance / slot_height) * slot_height + 1;
  //     } else {
  //       offset = Math.floor((mousedown.e.pageY - $(this).offset().top + 1) / slot_height) * slot_height;
  //       height = Math.ceil(distance / slot_height) * slot_height - 1;
  //     }
  //     if (height <= 0) {
  //       offset += height - 3;
  //     }
  //     mousedown.el.css({
  //       top: offset,
  //       height: Math.abs(height)
  //     });
  //     return updateTimeLabel(mousedown.el);
  //   });
  //   $('body').on('mouseup', function() {
  //     var ref, ref1, ref2;
  //     if (((ref = mousedown.el) != null ? ref.height() : void 0) === 0) {
  //       mousedown.el.remove();
  //     }
  //     if ((ref1 = resize_bottom_action.el) != null) {
  //       ref1.css('cursor', 'default');
  //     }
  //     if ((ref2 = resize_top_action.el) != null) {
  //       ref2.css('cursor', 'default');
  //     }
  //     mousedown.e = null;
  //     mousedown.el = null;
  //     move_action.e = null;
  //     move_action.el = null;
  //     resize_bottom_action.e = null;
  //     resize_bottom_action.e = null;
  //     resize_top_action.e = null;
  //     return resize_top_action.e = null;
  //   });
  //   $('.rmws-days').on('mousedown', '.rmws-event', function(e) {
  //     console.log('move');
  //     move_action.e = e;
  //     move_action.el = $(this);
  //     return move_action.cursor_offset = e.pageY - move_action.el.offset().top;
  //   });
  //   $('.rmws-days').on('mouseup', '.rmws-event', function(e) {
  //     move_action.e = null;
  //     return move_action.el = null;
  //   });
  //   $('.rmws-days').on('mousedown', '.rmws-handle-bottom', function(e) {
  //     e.stopPropagation();
  //     resize_bottom_action.e = e;
  //     resize_bottom_action.el = $(this).parent();
  //     return resize_bottom_action.el.css('cursor', 'row-resize');
  //   });
  //   $('.rmws-days').on('mousedown', '.rmws-handle-top', function(e) {
  //     e.stopPropagation();
  //     resize_top_action.e = e;
  //     resize_top_action.el = $(this).parent();
  //     resize_top_action.el.css('cursor', 'row-resize');
  //     resize_top_action.start_offset_bottom = $(this).parent().offset().top + $(this).parent().height();
  //     return resize_top_action.start_height = $(this).parent().height();
  //   });
  //   return $('.rmws-days').on('click', '.rmws-close', function(e) {
  //     return $(this).parent().remove();
  //   });
  // };

}
