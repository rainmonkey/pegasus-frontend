import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterStateSnapshot } from "@angular/router";
import { LearnersService } from "../../../../../services/http/learners.service"
import { NgbootstraptableService } from "../../../../../services/others/ngbootstraptable.service"
import { GeneralRepoService } from '../../../../../services/repositories/general-repo.service';


@Component({
  selector: 'app-learner-credit-details',
  templateUrl: './learner-credit-details.component.html',
  styleUrls: ['./learner-credit-details.component.css']
})
export class LearnerCreditDetailsComponent implements OnInit {

  public learner: any
  public learnerId: number
  public remainingCourseData: any
  public arrangedCourseData: any

  constructor(private learnerService: LearnersService,
    private activatedRouter: ActivatedRoute,
    private ngTableService: NgbootstraptableService,
    private router: Router,
    private generalRepoService: GeneralRepoService,
  ) { }

  ngOnInit() {
    this.generalRepoService.fisrtName.subscribe(data => {
      if (data == "Customer Name") {
        this.learnerId = +this.router.url.slice(this.router.url.lastIndexOf("/") + 1)
      } else {
        this.learner = data
        this.learnerId = this.learner.LearnerId
        console.log(this.learner, this.learnerId)
      }
      this.getRemainingCourses()
      this.getArrangedLesson()
    })
    console.log(this.learnerId)
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

}
