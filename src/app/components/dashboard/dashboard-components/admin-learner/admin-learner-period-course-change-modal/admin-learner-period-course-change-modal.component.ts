import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {timePickerValidator} from '../../../../../shared/time-picker.validators';
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
  Teachers;
  PeriodCourseChangeForm;

  @Input() whichLearner;
  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder,
              private service: LearnersService) { }

  ngOnInit() {
    this.GetOrg();
    this.PeriodCourseChangeForm = this.fb.group({
      BeginDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      BeginTime: ['', [Validators.required, timePickerValidator]],
      reason: ['', Validators.required],
      instanceId: ['', Validators.required],
      OrgId: ['', Validators.required],
      DayOfWeek: ['', Validators.required],
      IsTemporary: ['', Validators.required],
      CourseScheduleId: ['', Validators.required],
      TeacherId: ['', Validators.required],
      IsInvoiceChange: ['', Validators.required]
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

  get TeacherId() {
    return this.PeriodCourseChangeForm.get('TeacherId');
  }
  get CourseScheduleId() {
    return this.PeriodCourseChangeForm.get('CourseScheduleId');
  }
  get IsInvoiceChange() {
    return this.PeriodCourseChangeForm.get('IsInvoiceChange');
  }

  GetOrg = () => {
    this.service.GetOrgRoom().subscribe(res => {
      // @ts-ignore
      this.Orgs = res.Data;
    }, err => {
      console.log(err);
    });
  }


  submit = () => {
    if (this.PeriodCourseChangeForm.invalid) {
      this.checkInputVailad();
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
      1, this.PeriodCourseChangeForm.value.IsTemporary,
      this.PeriodCourseChangeForm.value.CourseScheduleId, this.PeriodCourseChangeForm.value.TeacherId,
      this.PeriodCourseChangeForm.value.IsInvoiceChange
    )
    this.service.PeriodCourseChange(model).subscribe(res => {
      this.isEditFail = false;
      this.isloading = false;
      this.isEditSuccess = true;
    }, err => {
      this.isConfirmClick = false;
      this.isEditFail = true;
      this.isloading = false;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }

  checkInputVailad = () => {
    for (let i in this.PeriodCourseChangeForm.controls) {
      this.PeriodCourseChangeForm.controls[i].touched = true;
    }
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
    if (this.PeriodCourseChangeForm.value.IsTemporary == 0) {
      this.PeriodCourseChangeForm.get('EndDate').reset();
      this.PeriodCourseChangeForm.get('EndDate').disable();
    } else {
      this.PeriodCourseChangeForm.get('EndDate').enable();
    }
  }

  GetTeachers = () => {
    if (!this.OrgId.invalid && !this.DayOfWeek.invalid) {
      this.service.GetTeacherRoomByOrgDayOfWeek(this.PeriodCourseChangeForm.get('OrgId').value, this.PeriodCourseChangeForm.get('DayOfWeek').value)
        .subscribe(res => {
          // @ts-ignore
          this.Teachers = res.Data;
      }, err => {
        console.log(err);
      });
    }
  }
}
