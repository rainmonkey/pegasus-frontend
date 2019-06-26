import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-amendment-History-modal',
  templateUrl: './amendment-History-modal.component.html',
  styleUrls: ['./amendment-History-modal.component.css']
})
export class AmendmentHistoryModalComponent implements OnInit {
@Input() whichCourse;

  constructor(
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit() {
    console.log(this.whichCourse)
  }

}
