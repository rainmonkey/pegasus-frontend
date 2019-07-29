import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {LearnerDayOff} from '../../../../../models/LearnerDayOff';
import {LearnersService} from '../../../../../services/http/learners.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-learner-leave',
  templateUrl: './admin-learner-leave.component.html',
  styleUrls: ['./admin-learner-leave.component.css']
})
export class AdminLearnerLeaveComponent implements OnInit {
  learner;
  hasError = false;
  errorMessage;
  checkboxArray = [];
  LearnerLeaveForm;
  modal;
  isloading = false;
  isConfirmClick = false;
  public isCancelSuccess = false;
  public isCancelFailed = false;
  @ViewChildren('checkbox') checkbox
  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder, private service: LearnersService) { }

  ngOnInit() {
    this.LearnerLeaveForm = this.fb.group({
      BeginDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Reason: ['', Validators.required]
    });
  }

  get BeginDate() {
    return this.LearnerLeaveForm.get('BeginDate');
  }
  get EndDate() {
    return this.LearnerLeaveForm.get('EndDate');
  }
  get Reason() {
    return this.LearnerLeaveForm.get('Reason');
  }

  Confirm = () => {
    this.isCancelFailed = false;
    if (this.LearnerLeaveForm.invalid) {
      this.CheckAllControllValid();
      this.hasError = true;
      this.errorMessage = 'The form is invalid';
      return;
    }
    this.hasError = false;
    this.isloading = true;
    this.isConfirmClick = true;
    const LearnerDayoffModel = new LearnerDayOff(
      localStorage.getItem('userID'), this.learner.LearnerId,
      this.LearnerLeaveForm.value.BeginDate, this.LearnerLeaveForm.value.EndDate,
      this.LearnerLeaveForm.value.Reason, this.checkboxArray
    );
    this.service.learnerDayOff(LearnerDayoffModel).subscribe(res => {
      this.isloading = false;
      this.isCancelSuccess = true;
    }, err => {
      this.isConfirmClick = false;
      this.isloading = false;
      this.isCancelFailed = true;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }

  checkBoxChange = () => {
    this.checkboxArray = [];
    this.checkbox._results.forEach(s => {
        if (s.nativeElement.checked === true) {
          this.checkboxArray.push(Number(s.nativeElement.value));
        }
    });
  }

  CheckAllControllValid = () => {
    for (let i in this.LearnerLeaveForm.controls) {
      this.LearnerLeaveForm.controls[i].touched = true;
    }
  }
}
