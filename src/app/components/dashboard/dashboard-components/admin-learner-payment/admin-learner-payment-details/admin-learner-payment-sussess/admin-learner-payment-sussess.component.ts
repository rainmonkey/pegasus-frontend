import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-learner-payment-sussess',
  templateUrl: './admin-learner-payment-sussess.component.html',
  styleUrls: ['./admin-learner-payment-sussess.component.css']
})
export class AdminLearnerPaymentSussessComponent implements OnInit {

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
