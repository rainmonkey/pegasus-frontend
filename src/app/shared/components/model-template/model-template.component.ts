import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-model-template',
  templateUrl: './model-template.component.html',
  styleUrls: ['./model-template.component.css']
})
export class ModelTemplateComponent implements OnInit {
@Input() whichObject;
@Input() whichModal;
modelTitle;

// for timetable
@Input() learnerCourseTimeTable;
titleArray;

constructor(public activeModal: NgbActiveModal,) {}
  getModalDetail(){
    switch (this.whichModal) {
      case 'payInvoice':
        this.modelTitle = 'Invoice Payment';
        break;
      case 'Learner Credit':
        this.modelTitle = 'Learner Credit';
        break;
      case 'Learner Timetable':
        this.modelTitle = 'Learner\'s Timetable';
        break;
      default:
      this.modelTitle = '';
    }
  }
  ShowTimeTableDetail(){
    this.titleArray = this.learnerCourseTimeTable.event.title.split(' ');
    this.modelTitle = 'Learner\'s Course Detail';
    console.log(this.learnerCourseTimeTable);
  }

  ngOnInit() {
    console.log(this.learnerCourseTimeTable)
    if (this.whichModal) {
    this.getModalDetail();
    }
    if (this.learnerCourseTimeTable){
      this.ShowTimeTableDetail()
    }
  }

}
