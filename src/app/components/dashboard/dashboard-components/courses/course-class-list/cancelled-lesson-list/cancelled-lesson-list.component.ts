import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {GroupSessionDetailEditModalComponent} from '../session-detail-edit-modal/group-session-detail-edit-modal.component'
import Swal from "sweetalert2";

import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { LearnersService } from "../../../../../../services/http/learners.service";
import { NgbootstraptableService } from "../../../../../../services/others/ngbootstraptable.service";
import { GeneralRepoService } from "../../../../../../services/repositories/general-repo.service";
import { GroupcourseComponent } from '../../../bookcourse/groupcourse/groupcourse.component';

@Component({
  selector: "app-cancelled-lesson-list",
  templateUrl: "./cancelled-lesson-list.component.html",
  styleUrls: ["./cancelled-lesson-list.component.css"]
})
export class CancelledLessonListComponent implements OnInit {
  // get learner id from model template component
  @Input() command; 
  @Input() whichCourseClass;
  public learner: any;
  public learnerId: number;
  public remainingCourseData: any;
  public arrangedCourseData: any;
  public remainingDataWaitingFlag = false;
  public arrangeDataWaitingFlag = false;
  public courseId: number;

  constructor(
    private learnerService: LearnersService,
    private ngTableService: NgbootstraptableService,
    private router: Router,
    private generalRepoService: GeneralRepoService,
    private modalService: NgbModal,    
  ) {}

  ngOnInit() {
    console.log(this.whichCourseClass);

    this.getRemainingCourses();
  }

  getRemainingCourses() {
    let groupCourseInstanceId = this.whichCourseClass.GroupCourseInstanceId
    this.learnerService.getGroupMakeupLesson(groupCourseInstanceId).subscribe(
      data => {
        this.remainingCourseData = data["Data"];
        console.log(this.remainingCourseData);
        this.remainingDataWaitingFlag = false;
      },
      error => console.log(error)
    );
  }

  MakeupGroupSession(index) {
    let MissedLesson =  this.remainingCourseData[index].MissedLesson;
    const modalRef = this.modalService.open(GroupSessionDetailEditModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      that.ngOnInit()
    }, (reason) => {
     console.log(reason);
    });
    modalRef.componentInstance.LessonModel = MissedLesson;
  }
  ChangeExpiryDate(awaitId, index) {
    Swal.fire({
      title: "How many days do you want to change?",
      input: "number",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      preConfirm: QTYofdays => {
        console.log(QTYofdays);
        this.updateExpiry(awaitId, QTYofdays, index);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      console.log(result);
    });
  }
  updateExpiry(awaitId, QTYofdays, index) {
    console.log(awaitId);
    let that = this;
    this.learnerService.updateExpiryDate(awaitId, QTYofdays).subscribe(
      data => {
        let newLesson = data["Data"];
        that.remainingCourseData[index].ExpiredDate = newLesson.ExpiredDate;
        // this.arrangeDataWaitingFlag = false;
      },
      error => {
        let errorMsg =
          error.error || error.error.ErrorMessage
            ? error.error.ErrorMessage
            : "Something error!";
        // Swal.fire({ title:'Oops', text:errorMsg, type: 'error'});
        alert(errorMsg);
        console.log(error);
      }
    );
  }
  alertForNoRemainingCourse() {
    alert("Sorry, you don't have remaining make up lesson");
  }
}
