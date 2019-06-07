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
    } else if (this.showTitle ==='registration'){
      this.router.navigate(['../registration'],{relativeTo: this.activatedRouter});
    } else if (this.showTitle ==='update'){
      this.router.navigate(['../'],{relativeTo: this.activatedRouter});
    } else {
        this.router.navigate(['../invoices'], {relativeTo: this.activatedRouter});
      }
  }

  ngOnInit() {
    switch (this.router.url) {
    case '/transaction/success':
      this.showTitle = 'edit';
    break;
    case '/learner/list/success':
      this.showTitle = 'update';
    case '/learner/success':
      this.showTitle = 'registration';
    break;
    default:
      this.showTitle = 'payment';
    }
  }

}
