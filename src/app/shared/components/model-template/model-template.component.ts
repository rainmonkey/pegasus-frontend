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

constructor(public activeModal: NgbActiveModal,) { }
  getModalDetail(){
    switch (this.whichModal) {
      case 'payInvoice':
      this.modelTitle = 'Invoice Payment';
        break;
      case 'Learner Credit':
        this.modelTitle = 'Learner Credit';
      case 'Learner Timetable':
        this.modelTitle = 'Learner\'s Timetable';
      default:
      this.modelTitle = '';
    }
  }
  ngOnInit() {
    this.getModalDetail()
  }

}
