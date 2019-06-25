import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterStateSnapshot } from "@angular/router";
import { LearnersService } from "../../../../../services/http/learners.service"
import { NgbootstraptableService } from "../../../../../services/others/ngbootstraptable.service"


@Component({
  selector: 'app-learner-credit-details',
  templateUrl: './learner-credit-details.component.html',
  styleUrls: ['./learner-credit-details.component.css']
})
export class LearnerCreditDetailsComponent implements OnInit {

  public data: any
  public learnerId: any
  public remainingCourseData: any
  public arrangedCourseData: any

  constructor(private learnerService: LearnersService,
    private activatedRouter: ActivatedRoute,
    private ngTableService: NgbootstraptableService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
    })

    this.getLearnerList()
    this.getRemainingCourses()
    this.getArrangedLesson()
  }

  getLearnerList() {
    this.learnerService.getLearnerList().subscribe(data => {
      this.data = data["Data"]
      this.data = this.data.find(learner => learner.LearnerId == this.learnerId)
    }, error => console.log(error))
  }

  getRemainingCourses() {
    this.learnerService.getRemainingCourses(this.learnerId).subscribe(data => {
      this.remainingCourseData = data["Data"]
    }, error => console.log(error)
    )
  }

  getArrangedLesson() {
    this.learnerService.getArrangedLesson(this.learnerId).subscribe(data => {
      this.arrangedCourseData = data["Data"]
    }, error => console.log(error))
  }

  onSort(tableName: string, orderBy: string) {
    if (tableName == "arrangedTable") {
      this.ngTableService.sorting(this.arrangedCourseData, orderBy)
    } else if (tableName == "remaningTable") {
      this.ngTableService.sorting(this.remainingCourseData, orderBy)
    }
  }

  navigateToArrange() {
    let url = this.router.routerState.snapshot.url;
    url = url.substring(0, url.lastIndexOf("/"))
    this.router.navigate([url + "/arrange"], { queryParams: { LearnerId: this.learnerId } })
  }

  ngOnDestroy() {
    console.log("destroy")
  }

}
