import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SessionsService } from '../../../../../../services/http/sessions.service';
import { SessionEdit } from '../../../../../../models/SessionEdit';
import { TrialModalComponent } from 'src/app/components/dashboard/dashboard-components/trial-session/trial-modal/trial-modal.component';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-session-detail-edit-modal',
  templateUrl: './session-detail-edit-modal.component.html',
  styleUrls: ['./session-detail-edit-modal.component.css'],
})
export class SessionDetailEditModalComponent implements OnInit {
  @Input() LessonModel;
  isloading = false;
  isEditSuccess = false;
  isEditFail = false;
  ConfirmClick = false;
  public errorMsg;
  public hasError = false;
  public SessionForm;
  BranchSelects: any;
  RoomSelects: any;
  TeacherSelects: any;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private sessionsService: SessionsService,
    private datePipe: DatePipe,
  ) {

  }

  // set access porperty of SessionForm
  get Branch() {
    return this.SessionForm.get('Branch');
  }

  get Reason() {
    return this.SessionForm.get('Reason');
  }

  get Room() {
    return this.SessionForm.get('Room');
  }

  get Teacher() {
    return this.SessionForm.get('Teacher');
  }

  ngOnInit() {
    this.SessionForm = this.fb.group({
      CourseName: [this.LessonModel.CourseName],
      Room: ['', [Validators.required]],
      BeginTime: [this.LessonModel.BeginTime],
      Teacher: ['', [Validators.required]],
      Branch: ['', [Validators.required]],
      Reason: ['', [Validators.required]]
    });
    this.getBranchs();
  }


  getRooms = () => {
    // @ts-ignore
    const dateDiff = Number(new Date(this.LessonModel.EndTime) - new Date(this.LessonModel.BeginTime))
    if ((!this.Branch.touched || this.Branch.invalid) || (!this.Teacher.touched || this.Teacher.invalid)) {
      return;
    }
    this.sessionsService.GetSessionEditRoom(this.SessionForm.value.Teacher, this.SessionForm.value.Branch,
      this.SessionForm.value.BeginTime).subscribe(res => {
        if (res.Data.length == 0) {
          const EditBeginTime = new Date(this.SessionForm.value.BeginTime)
          const EditEndTime = new Date(this.SessionForm.value.BeginTime);
          console.log(EditBeginTime.getMinutes().toString().length)
          EditEndTime.setMinutes(EditBeginTime.getMinutes() + (dateDiff / 60 / 1000));
          const BeginTime = EditBeginTime.getFullYear() + '-' + (EditBeginTime.getMonth() + 1) + '-' + EditBeginTime.getDate() + 'T' +
            EditBeginTime.getHours() + ':' + (EditBeginTime.getMinutes().toString().length === 1 ? '0' + EditBeginTime.getMinutes().toString() : EditBeginTime.getMinutes())
          const EndTime = EditEndTime.getFullYear() + '-' + (EditEndTime.getMonth() + 1) + '-' + EditEndTime.getDate() + 'T' +
            EditEndTime.getHours() + ':' + (EditEndTime.getMinutes().toString().length === 1 ? '0' + EditEndTime.getMinutes().toString() : EditEndTime.getMinutes())
          this.sessionsService.GetSessionEditRoomTwo(this.SessionForm.value.Branch, BeginTime, EndTime).subscribe(data => {
            this.RoomSelects = data.Data;
          });
        } else {
          this.RoomSelects = res.Data;
        }
      });
  }

  getBranchs = () => {
    this.sessionsService.GetTeachherFilter(this.LessonModel.courseId).subscribe(res => {
      this.BranchSelects = res.Data;
    }, err => {
      alert('Something ERR');
    });
  }

  getTeachers = (branchId) => {
    this.TeacherSelects = this.BranchSelects.filter(s => s.OrgId == branchId)[0].Teacher;
    console.log(this.TeacherSelects, this.BranchSelects)
  }

  // confirm Modal
  open(confirmModal) {
    if (this.SessionForm.invalid) {
      this.errorMsg = 'The form is invalid.';
      this.hasError = true;
    } else {
      this.hasError = false;
      this.modalService.open(confirmModal);

    }
  }

  openTimePicker = () => {
    console.log(this.LessonModel, this.LessonModel.CourseName.split("-")[0])
    let orgId: number = +this.SessionForm.get("Branch").value
    let orgName: string = this.BranchSelects.find(branch => branch.OrgId == orgId).OrgName
    let modalRef = this.modalService.open(TrialModalComponent, { size: 'lg', backdrop: 'static', keyboard: false })
    modalRef.componentInstance.LearnerId = this.LessonModel.LearnerId
    modalRef.componentInstance.TeacherId = this.LessonModel.TeacherId
    modalRef.componentInstance.orgName = orgName
    modalRef.componentInstance.orgId = orgId
  }

  ConfrimEdit = () => {
    this.isloading = true;
    this.ConfirmClick = true;
    const sessionEdit = new SessionEdit(this.LessonModel.LessonId,
      this.LessonModel.LearnerId, parseInt(this.SessionForm.value.Room),
      parseInt(this.SessionForm.value.Teacher), parseInt(this.SessionForm.value.Branch), this.SessionForm.value.Reason,
      this.SessionForm.value.BeginTime);

    this.sessionsService.SessionEdit(sessionEdit).subscribe(res => {
      this.isEditSuccess = true;
      this.isloading = false;
      setTimeout(() => {
        this.activeModal.dismiss('Cross click');
      }, 1000);
    },
      err => {
        this.isEditFail = true;
        this.isloading = false;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err.error.ErrorMessage,
        });
      });

  }
}
