import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-staff-detail-modal',
  templateUrl: './staff-detail-modal.component.html',
  styleUrls: ['./staff-detail-modal.component.css']
})
export class StaffDetailModalComponent implements OnInit {
  @Input() command;
  @Input() whichStaff;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
