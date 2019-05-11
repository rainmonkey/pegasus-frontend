import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-learner-payment-success',
  templateUrl: './admin-learner-payment-success.component.html',
  styleUrls: ['./admin-learner-payment-success.component.css']
})
export class AdminLearnerPaymentSuccessComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }

  backToSearch() {
    this.router.navigate(['../'], {relativeTo: this.activatedRouter});
  }


  ngOnInit() {
  }

}
