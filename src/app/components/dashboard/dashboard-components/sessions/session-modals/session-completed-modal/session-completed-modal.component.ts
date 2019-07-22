import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionsService} from '../../../../../../services/http/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-session-completed-modal',
  templateUrl: './session-completed-modal.component.html',
  styleUrls: ['./session-completed-modal.component.css']
})
export class SessionCompletedModalComponent implements OnInit {
  lessonId;
  isloading = false;
  ConfirmClick = false;
  public info;
  public isComfirmSuccess
  public isConfirmFailed
  constructor(public activeModal: NgbActiveModal, private sessionsService: SessionsService,
              private router: Router) { }

  ngOnInit() {
  }

  CompletedConfirm = () => {
    this.isloading = true;
    this.ConfirmClick = true;
    this.sessionsService.SessionCompleted(this.lessonId, this.info).subscribe(res => {
      this.isComfirmSuccess = true;
      this.isloading = false;
      setTimeout(() => {
        this.activeModal.dismiss('Cross click');
      }, 1000);
    }, err => {
      console.log(err);
      this.isConfirmFailed = true;
      this.isloading = false;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }
}
