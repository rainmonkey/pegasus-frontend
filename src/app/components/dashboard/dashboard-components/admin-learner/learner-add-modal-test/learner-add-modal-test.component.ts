
import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-learner-add-modal-test',
  templateUrl: './learner-add-modal-test.component.html',
  styleUrls: ['./learner-add-modal-test.component.css']
})
export class LearnerAddModalTestComponent implements OnInit {

  addCourse = true;
  toAddLearnerModal = false;
  @Input() whichLearner;
  @Input() command;
  @Output() signalForInit: EventEmitter<any> = new EventEmitter;
  constructor(public activeModal: NgbActiveModal ) {

  }
  toLearnerListEvent(event){
    if(event == true){
      this.activeModal.dismiss();
      this.signalForInit.emit(true);
    }
  }
  ngDoCheck(){
   // console.log(this.toAddLearnerModal);
  }
  ngOnInit() {
    
  }
}
