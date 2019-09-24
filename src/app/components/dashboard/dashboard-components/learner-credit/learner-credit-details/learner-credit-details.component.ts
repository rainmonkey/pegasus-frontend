import { Component, OnInit, Input } from "@angular/core";
import { ModelTemplateComponent } from "src/app/shared/components/model-template/model-template.component";
import Swal from "sweetalert2";

import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { LearnersService } from "../../../../../services/http/learners.service";
import { NgbootstraptableService } from "../../../../../services/others/ngbootstraptable.service";
import { GeneralRepoService } from "../../../../../services/repositories/general-repo.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-learner-credit-details",
  templateUrl: "./learner-credit-details.component.html",
  styleUrls: ["./learner-credit-details.component.css"]
})
export class LearnerCreditDetailsComponent implements OnInit {
  // get learner id from model template component
  @Input() whichLearner;
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
    private modalService:NgbModal
  ) {}

  ngOnInit() {
    if (this.whichLearner!=null){
      this.learnerId = this.whichLearner;
      this.getRemainingCourses();
      this.getArrangedLesson();
      return
  }
    this.generalRepoService.fisrtName.subscribe(
      data => {
        if (data == "Customer Name") {
          this.learnerId = +this.router.url.slice(
            this.router.url.lastIndexOf("/") + 1
          );
        } else {
          this.learner = data;
          this.learnerId = this.learner.LearnerId;
        }
        console.log(this.learnerId);
        this.getRemainingCourses();
        this.getArrangedLesson();
      },
      err => console.log(err)
    );
  }

  getRemainingCourses() {
    this.remainingDataWaitingFlag = true;
    this.learnerService.getRemainingCourses(this.learnerId).subscribe(
      data => {
        this.remainingCourseData = data["Data"];
        console.log(this.remainingCourseData);
        this.remainingDataWaitingFlag = false;
      },
      error => console.log(error)
    );
  }

  getArrangedLesson() {
    this.arrangeDataWaitingFlag = true;
    this.learnerService.getArrangedLesson(this.learnerId).subscribe(
      data => {
        this.arrangedCourseData = data["Data"];
        this.arrangeDataWaitingFlag = false;
      },
      error => console.log(error)
    );
  }

  onSort(tableName: string, orderBy: string) {
    if (tableName == "arrangedTable") {
      this.ngTableService.sorting(this.arrangedCourseData, orderBy);
    } else if (tableName == "remaningTable") {
      this.ngTableService.sorting(this.remainingCourseData, orderBy);
    }
  }
  ToArrange(index){
    let courseId =
      this.remainingCourseData[index].CourseInstanceId;
    const modalRef = this.modalService
    //@ts-ignore
    .open(ModelTemplateComponent,{ size:'xl', backdrop: 'static', keyboard: false });
    let that = this;
    modalRef.result.then(
      (res) => {
        that.ngOnInit();
      },
      (err) => {
        return;
      }
    );
    modalRef.componentInstance.whichObject = courseId;
    modalRef.componentInstance.whichModal = "Lesson Rescheduling";
  }
  navigateToArrange(index) {
    this.courseId =
      this.remainingCourseData[index].CourseInstanceId ||
      this.remainingCourseData[index].GroupCourseInstanceId;

    let url = this.router.routerState.snapshot.url;
    url = url.substring(0, url.indexOf("/", 1));
    this.router.navigate([
      url + "/arrange/" + this.learnerId + "/" + this.courseId
    ]);
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
    alert("Sorry, you don't have remaining course");
  }
}
