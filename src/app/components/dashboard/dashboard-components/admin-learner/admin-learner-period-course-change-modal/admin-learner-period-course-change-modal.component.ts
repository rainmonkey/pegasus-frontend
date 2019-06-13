import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {LearnersService} from '../../../../../services/http/learners.service';
import {PeriodCourseDurationChange} from '../../../../../models/PeriodCourseDurationChange';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-learner-period-course-change-modal',
  templateUrl: './admin-learner-period-course-change-modal.component.html',
  styleUrls: ['./admin-learner-period-course-change-modal.component.css']
})
export class AdminLearnerPeriodCourseChangeModalComponent implements OnInit {
  errorMessage;
  IsformError = false;
  isEditSuccess = false;
  isEditFail = false;
  isloading = false;
  isConfirmClick = false;
  learner;
  Orgs;
  Rooms;
  PeriodCourseChangeForm;
  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder,
              private service: LearnersService) { }

  ngOnInit() {
    this.GetOrgRoom();
    this.PeriodCourseChangeForm = this.fb.group({
      BeginDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      BeginTime: ['', Validators.required],
      reason: ['', Validators.required],
      instanceId: ['', Validators.required],
      OrgId: ['', Validators.required],
      RoomId: ['', Validators.required],
      DayOfWeek: ['', Validators.required],
      IsTemporary: ['', Validators.required],
      CourseScheduleId: ['', Validators.required]
    });
  }

  get BeginDate() {
    return this.PeriodCourseChangeForm.get('BeginDate');
  }

  get BeginTime() {
    return this.PeriodCourseChangeForm.get('BeginTime');
  }

  get OrgId() {
    return this.PeriodCourseChangeForm.get('OrgId');
  }

  get RoomId() {
    return this.PeriodCourseChangeForm.get('RoomId');
  }

  get DayOfWeek() {
    return this.PeriodCourseChangeForm.get('DayOfWeek');
  }

  get IsTemporary() {
    return this.PeriodCourseChangeForm.get('IsTemporary');
  }

  get reason() {
    return this.PeriodCourseChangeForm.get('reason');
  }

  get instanceId() {
    return this.PeriodCourseChangeForm.get('instanceId');
  }

  GetOrgRoom = () => {
    this.service.GetOrgRoom().subscribe(res => {
      // @ts-ignore
      this.Orgs = res.Data;
    }, err => {
      console.log(err);
    });
  }

  GetRoom = (OrgId) => {
    this.Rooms = this.Orgs.filter(s => s.OrgId == OrgId)[0].Rooms;
  }

  submit = () => {
    if (this.PeriodCourseChangeForm.invalid) {
      this.errorMessage = 'The form is Invalid';
      this.IsformError = true;
      return;
    }
    this.IsformError = false;
    this.isloading = true;
    this.isConfirmClick = true;
    const model = new PeriodCourseDurationChange(
      localStorage.getItem('userID'), this.learner.LearnerId, this.PeriodCourseChangeForm.value.BeginDate,
      this.PeriodCourseChangeForm.value.EndDate,
      this.PeriodCourseChangeForm.value.reason, this.PeriodCourseChangeForm.value.instanceId, this.PeriodCourseChangeForm.value.OrgId,
      this.PeriodCourseChangeForm.value.DayOfWeek, this.PeriodCourseChangeForm.value.BeginTime, this.PeriodCourseChangeForm.value.EndTime,
      this.PeriodCourseChangeForm.value.RoomId, this.PeriodCourseChangeForm.value.IsTemporary,
      this.PeriodCourseChangeForm.value.CourseScheduleId
    )
    this.service.PeriodCourseChange(model).subscribe(res => {
      this.isEditFail = false;
      this.isloading = false;
      this.isEditSuccess = true;
      console.log(res);
    }, err => {
      this.isConfirmClick = false;
      this.isEditFail = true;
      this.isloading = false;
      console.log(err);
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }

  CourseRadioButtonChange = () => {
    this.PeriodCourseChangeForm.patchValue({
      CourseScheduleId: null
    });
  }

  ScheduleRadioButtonChange = (courseInstanceId) => {
    this.PeriodCourseChangeForm.patchValue({
      instanceId: courseInstanceId
    });
  }

  IsTemporaryChange = () => {
    if (this.PeriodCourseChangeForm.value.IsTemporary == 1) {
      this.PeriodCourseChangeForm.get('EndDate').reset();
      this.PeriodCourseChangeForm.get('EndDate').disable();
    } else {
      this.PeriodCourseChangeForm.get('EndDate').enable();
    }
  }
}
