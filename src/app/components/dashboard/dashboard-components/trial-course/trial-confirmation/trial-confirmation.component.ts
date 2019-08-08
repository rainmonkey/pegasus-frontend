import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trial-confirmation',
  templateUrl: './trial-confirmation.component.html',
  styleUrls: ['../../../../../shared/css/bootstrap-default-clear.css',
    './trial-confirmation.component.css']
})
export class TrialConfirmationComponent implements OnInit {

  @Input() confirmationData: IConfirmData;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}

export interface IConfirmData {
  teacherId: number,
  teacherName: string,
  startTimeStamp: number,
  endTimeStamp: number,
  orgId: number,
  orgName: string,
}