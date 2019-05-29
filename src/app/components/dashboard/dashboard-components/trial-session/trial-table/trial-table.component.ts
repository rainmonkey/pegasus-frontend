import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trial-table',
  templateUrl: './trial-table.component.html',
  styleUrls: ['./trial-table.component.css']
})
export class TrialTableComponent implements OnInit {
  public teacherLevel: Array<any> = [];

  @Input('courses') courses;

  constructor() { }

  ngOnInit() {
  }

}
