import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-learner-payment-success',
  templateUrl: './admin-learner-payment-success.component.html',
  styleUrls: ['./admin-learner-payment-success.component.css']
})
export class AdminLearnerPaymentSuccessComponent implements OnInit {
  public showTitle;
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }



  backToSearch() {
      if (this.showTitle === 'payment'){
      this.router.navigate(['../'], {relativeTo: this.activatedRouter});
    } else {
        this.router.navigate(['../invoices'], {relativeTo: this.activatedRouter});
      }
  }

  ngOnInit() {
    switch (this.router.url) {
    case '/transaction/success':
    this.showTitle = 'edit';
    break;
    default:
    this.showTitle = 'payment';
    }
  }

}
