import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
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

  constructor(private learnerService: LearnersService,
    private activatedRouter: ActivatedRoute,
    private ngTableService: NgbootstraptableService
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
    })

    this.getLearnerList()
    this.getRemainingCourses()
    
  }

  getLearnerList() {
    this.learnerService.getLearnerList().subscribe(data => {
      this.data = data["Data"]
      this.data = this.data.find(learner => learner.LearnerId == this.learnerId)
      console.log(this.data)
    }, error => console.log(error))
  }

  getRemainingCourses() {
    this.learnerService.getRemainingCourses(this.learnerId).subscribe(data => {
      this.remainingCourseData = data["Data"]
      console.log(this.remainingCourseData)
    }, error => console.log(error)
    )
  }

  // onSort(orderBy) {
  //   let orderControl = this.ngTableService.sorting(this.learnerList, orderBy)
  // }

}
