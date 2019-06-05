import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';

@Component({
  selector: 'app-learner-registration-confirm-modal',
  templateUrl: './learner-registration-confirm-modal.component.html',
  styleUrls: ['./learner-registration-confirm-modal.component.css']
})
export class LearnerRegistrationConfirmModalComponent implements OnInit {
  fdObj = {};
  errorMsg;
  // loading icon
  isloading = false;
  isConfirmClick = false;
  constructor(
    public activeModal: NgbActiveModal,
    private registrationService: LearnerRegistrationService,
    private router: Router
    ) { }

  ngOnInit() {
  }
  onSubmit(){
    // return console.log(this.fdObj)
    this.isloading = true;
    this.isConfirmClick = true;
    this.registrationService.postStudent(this.fdObj)
    .subscribe(
      data => {
        this.isloading = false;
        this.isConfirmClick = false;
        console.log('Success!', data);
        this.router.navigate(['/learner/success']);
      },
      error => {
        this.isloading = false;
        this.isConfirmClick = false;
        this.errorMsg = error;
        console.log('Error!', error);
      }
    )
    this.activeModal.dismiss();
  }
}
