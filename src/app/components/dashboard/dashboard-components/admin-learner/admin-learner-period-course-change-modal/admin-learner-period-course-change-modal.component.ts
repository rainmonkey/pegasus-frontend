import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {LearnersService} from '../../../../../services/http/learners.service';
import {PeriodCourseDurationChange} from '../../../../../models/PeriodCourseDurationChange';

@Component({
  selector: 'app-admin-learner-period-course-change-modal',
  templateUrl: './admin-learner-period-course-change-modal.component.html',
  styleUrls: ['./admin-learner-period-course-change-modal.component.css']
})
export class AdminLearnerPeriodCourseChangeModalComponent implements OnInit {
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
    console.log(this.learner)
    this.GetOrgRoom();
    this.PeriodCourseChangeForm = this.fb.group({
      BeginDate: [],
      EndDate: [],
      BeginTime: [],
      EndTime: [],
      reason: [],
      instanceId: [],
      OrgId: [],
      RoomId: [],
      DayOfWeek: [],
      IsTemporary: [],
      CourseScheduleId: []
    });
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
      this.isloading = false;
      this.isEditSuccess = true;
      console.log(res);
    }, err => {
      this.isConfirmClick = false;
      this.isEditFail = true;
      this.isloading = false;
      console.log(err);
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
}
