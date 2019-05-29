import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trial-search',
  templateUrl: './trial-search.component.html',
  styleUrls: ['./trial-search.component.css',
              '../../teachers/teacher-panel/teacher-panel.component.css']
})
export class TrialSearchComponent implements OnInit {

  @Input() courses;
  @Input() coursesCate;

  constructor() { }

  ngOnInit() {
  }

}
