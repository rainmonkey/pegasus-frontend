import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { SessionsService } from "../../../../../../services/http/sessions.service";
import { SessionEdit } from "../../../../../../models/SessionEdit";
import Swal from "sweetalert2";
import { TrialCalendarComponent } from "../../../trial-course/trial-calendar/trial-calendar.component";
import { OrgFormatPipe } from 'src/app/shared/pipes/org-format.pipe';

@Component({
  selector: "app-group-session-detail-edit-modal",
  templateUrl: "./group-session-detail-edit-modal.component.html",
  styleUrls: ["./group-session-detail-edit-modal.component.css"]
})
export class GroupSessionDetailEditModalComponent implements OnInit {
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
  duration: number;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private sessionsService: SessionsService
  ) {}

  // set access porperty of SessionForm
  get Branch() {
    return this.SessionForm.get("Branch");
  }

  get Reason() {
    return this.SessionForm.get("Reason");
  }

  get Room() {
    return this.SessionForm.get("Room");
  }

  get Teacher() {
    return this.SessionForm.get("Teacher");
  }

  ngOnInit() {
    console.log(this.LessonModel);
    this.SessionForm = this.fb.group({
      CourseName: [this.LessonModel.CourseName],
      Room: [this.LessonModel.RoomId, [Validators.required]],
      BeginTime: [this.LessonModel.BeginTime],
      Teacher: [this.LessonModel.TeacherId, [Validators.required]],
      Branch: [this.LessonModel.OrgId, [Validators.required]]
    });
    this.getBranchs();
  }

  getRooms = (branchId) => {
    console.log(branchId);
    let branch = this.BranchSelects.find(Org =>{
      return Org.OrgId == branchId;
    });
    console.log(branch);
    this.RoomSelects =  branch.Rooms
  };

  getBranchs = () => {
    this.sessionsService.GetRoomAndBranch().subscribe(
      res => {
        this.BranchSelects = res.Data;
        console.log(this.BranchSelects);
        this.getRooms(this.BranchSelects[0].OrgId);
        this.getTeachers(this.BranchSelects[0].OrgId);
      },
      err => {
        alert("Something ERR");
      }
    );
  };

  getTeachers = (branchId: number) => {
    console.log(branchId);
    this.sessionsService.GetTeacherByOrg(branchId).subscribe(
      res => {
        let orgAndTeachers = res.Data;
        console.log(orgAndTeachers);
        this.TeacherSelects = [];
        orgAndTeachers.forEach(ele => {
          this.TeacherSelects.push({TeacherName:ele.Teacher.FirstName+' '+ele.Teacher.LastName,TeacherId:ele.Teacher.TeacherId});
        });
        console.log(this.TeacherSelects);
      },
      err => {
        alert("Something ERR");
      }
    );
  };

  // confirm Modal
  open(confirmModal) {
    if (this.SessionForm.invalid) {
      this.errorMsg = "The form is invalid.";
      this.hasError = true;
    } else {
      this.hasError = false;
      this.modalService.open(confirmModal);
    }
  }

  openTimePicker = () => {
    const orgId: number = +this.SessionForm.get("Branch").value;
    const orgName: string = this.BranchSelects.find(
      branch => branch.OrgId === orgId
    ).OrgName;
    const teacherId = +this.SessionForm.get("Teacher").value;
    this.duration =
      new Date(this.LessonModel.EndTime).getTime() -
      new Date(this.LessonModel.BeginTime).getTime();

    const modalRef = this.modalService.open(TrialCalendarComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.teacherId = teacherId;
    modalRef.componentInstance.orgName = orgName;
    modalRef.componentInstance.orgId = orgId;
    modalRef.componentInstance.duration = this.duration;
    modalRef.componentInstance.userSelectedTime.subscribe(res => {
      this.SessionForm.get("BeginTime").patchValue(res);
    });
  };

  ConfrimEdit = () => {
    this.isloading = true;
    this.ConfirmClick = true;
    const sessionEdit = new SessionEdit(
      this.LessonModel.LessonId,
      this.LessonModel.LearnerId,
      +this.SessionForm.value.Room,
      +this.SessionForm.value.Teacher,
      +this.SessionForm.value.Branch,
      this.SessionForm.value.Reason,
      this.SessionForm.value.BeginTime
    );

    const sessionNew = {
      awaitId:this.LessonModel.awaitId,
      orgId:this.SessionForm.value.Branch,
      roomId:this.SessionForm.value.Room,
      teacherId:this.SessionForm.value.Teacher,
      beginTime:this.SessionForm.value.BeginTime
    }
    this.sessionsService.GroupSessionEdit(sessionNew).subscribe(
      res => {
        this.isEditSuccess = true;
        this.isloading = false;
        Swal.fire({
          type: "success",
          title: "Success",
          text: "Your Operation Was Completed Successfully!"
        });        
        setTimeout(() => {
          this.activeModal.dismiss("Cross click");
        }, 1000);
      },
      err => {
        this.isEditFail = true;
        this.isloading = false;
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: err.error.ErrorMessage
        });
      }
    );
  };
}
