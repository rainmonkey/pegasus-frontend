import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trial-confirm',
  templateUrl: './trial-confirm.component.html',
  styleUrls: ['./trial-confirm.component.css']
})
export class TrialConfirmComponent implements OnInit {

  @Input() startTime;
  @Input() endTime;
  @Input() orgName;
  @Input() cateName;
  @Input() whichTeacher;
  
  public whichTeacherFullName;
  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,) { }

  ngOnInit() {
    this.startTime = this.timeFormatting(this.startTime);
    this.endTime = this.timeFormatting(this.endTime);
    this.whichTeacherFullName = this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
  }

  timeFormatting(time){
    return time.replace('T','  ');
  }

}
