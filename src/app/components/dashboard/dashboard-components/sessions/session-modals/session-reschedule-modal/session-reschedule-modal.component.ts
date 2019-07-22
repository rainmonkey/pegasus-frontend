import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionsService} from '../../../../../../services/http/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-session-reschedule-modal',
  templateUrl: './session-reschedule-modal.component.html',
  styleUrls: ['./session-reschedule-modal.component.css']
})
export class SessionRescheduleModalComponent implements OnInit {
  @Input() lessonid: any;
  reason;
  isRescheduleSuccess = false;
  isRescheduleFail = false;
  isloading = false;
  isConfirmClick = false;
  errReason;
  constructor(public activeModal: NgbActiveModal, private sessionsService: SessionsService,
              private router: Router) { }

  ngOnInit() {
  }
  RescheduleConfirm = () => {
    this.isloading = true;
    this.isConfirmClick = true;
    this.errReason = '';
    this.sessionsService.SessionReSchedule(this.lessonid, this.reason).subscribe(res => {
      this.isloading = false;
      this.isRescheduleSuccess = true;
      setTimeout(() => {
        this.activeModal.dismiss('Cross click');
      }, 1000);
    }, err => {
      //this.errReason = err.error.ErrorMessage
      this.isloading = false;
      this.isRescheduleFail = true;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }
}
