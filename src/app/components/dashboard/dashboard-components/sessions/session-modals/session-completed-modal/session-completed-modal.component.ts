import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionsService} from '../../../../../../services/http/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-session-completed-modal',
  templateUrl: './session-completed-modal.component.html',
  styleUrls: ['./session-completed-modal.component.css']
})
export class SessionCompletedModalComponent implements OnInit {
  lessonId;
  public info;
  public isComfirmSuccess
  public isConfirmFailed
  constructor(public activeModal: NgbActiveModal, private sessionsService: SessionsService,
              private router: Router) { }

  ngOnInit() {
  }

  CompletedConfirm = () => {
    this.sessionsService.SessionCompleted(this.lessonId,this.info).subscribe(res => {
      this.isComfirmSuccess = true;
    }, err => {
      this.isConfirmFailed = true;
    });
  }
}
