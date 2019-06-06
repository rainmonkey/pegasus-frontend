import { Component, OnInit } from '@angular/core';
import { LearnersService } from "../../../../../services/http/learners.service"
import { ActivatedRoute, ParamMap, Router } from "@angular/router";


@Component({
  selector: 'app-learner-credit-details',
  templateUrl: './learner-credit-details.component.html',
  styleUrls: ['./learner-credit-details.component.css']
})
export class LearnerCreditDetailsComponent implements OnInit {

  public data: any
  public learnerId: any

  constructor(private learnerService: LearnersService,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
    })
    this.learnerService.getLearnerList().subscribe(data => {
      this.data = data["Data"]
      this.data = this.data.find(learner => learner.LearnerId == this.learnerId)
      console.log(this.data)
    }, error => {
      console.log(error)
    })
  }

}
