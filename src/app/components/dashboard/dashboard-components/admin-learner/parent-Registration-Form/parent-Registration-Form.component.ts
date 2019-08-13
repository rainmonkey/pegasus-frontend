import { Component, OnInit, Input } from '@angular/core';
import { Command } from 'protractor';

@Component({
  selector: 'app-parent-Registration-Form',
  templateUrl: './parent-Registration-Form.component.html',
  styleUrls: ['./parent-Registration-Form.component.css']
})
export class ParentRegistrationFormComponent implements OnInit {
@Input() command
@Input() whichLearner
@Input() newLearner
  constructor() { }

  ngOnInit() {
  }

}
