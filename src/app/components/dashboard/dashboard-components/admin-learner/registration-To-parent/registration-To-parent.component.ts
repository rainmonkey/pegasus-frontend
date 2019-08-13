import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-To-parent',
  templateUrl: './registration-To-parent.component.html',
  styleUrls: ['./registration-To-parent.component.css']
})
export class RegistrationToParentComponent implements OnInit {

  @Input() command
  @Input() newLearner;
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit() {
    console.log(this.whichLearner)
  }

  onClose(){
    this.activeModal.close('Cross click');
  }
}
