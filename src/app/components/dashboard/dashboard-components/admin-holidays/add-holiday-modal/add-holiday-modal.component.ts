import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-add-holiday-modal',
  templateUrl: './add-holiday-modal.component.html',
  styleUrls: ['./add-holiday-modal.component.css']
})
export class AddHolidayModalComponent implements OnInit {

@Input() date
  constructor() { }

  ngOnInit() {
  }

}
