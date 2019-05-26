import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionsService} from '../../../../../../services/http/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-session-cancel-modal',
  templateUrl: './session-cancel-modal.component.html',
  styleUrls: ['./session-cancel-modal.component.css'],
})
export class SessionCancelModalComponent implements OnInit {
  public CancelReason;
  public isCancelSuccess = false;
  public isCancelFailed = false;
  @Input() lessionId: any;
  constructor(public activeModal: NgbActiveModal, private sessionsService: SessionsService,
              private router: Router) { }

  ngOnInit() {
  }

  CancelConfirm = () => {
    this.sessionsService.DeleteSession(this.lessionId, this.CancelReason).subscribe( data => {
      this.isCancelSuccess = true;
    }, err => {
      this.isCancelFailed = true;
    });
  }
}
