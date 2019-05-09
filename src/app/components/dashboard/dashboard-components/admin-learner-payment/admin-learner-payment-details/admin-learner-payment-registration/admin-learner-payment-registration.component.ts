import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/http/payment.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
@Component({
  selector: 'app-admin-learner-payment-registration',
  templateUrl: './admin-learner-payment-registration.component.html',
  styleUrls: ['./admin-learner-payment-registration.component.css']
})
export class AdminLearnerPaymentRegistrationComponent implements OnInit {
  // post other payment
  public regiPaymentObj;
  public paymentTitle;
  public paymentAmount;
  public learnerId;
  public errorMsg;
  constructor(
    private fb: FormBuilder,
    private paymentRegiService: PaymentService,
    private activatedRouter: ActivatedRoute,
    private router: Router
    ) { }

  // other fb
  regiPayment = this.fb.group({
    title: ['Registration Fee', Validators.required],
    amount: ['', Validators.required]
  });
  get title() {
    return this.regiPayment.get('title');
  }
  get amount() {
    return this.regiPayment.get('amount');
  }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
    });
  }
  regiPaymentSubmit() {
    const title = this.regiPayment.value.title;
    const amount = this.regiPayment.value.amount;
    const conf = confirm(`the title of the payment is ${title}, the amount is ${amount}$, Please Confirm`);
    if (conf) {
    this.regiPaymentObj = {
      StaffId: 1,
      id: this.learnerId,
      title: this.regiPayment.value.title,
      amount: this.regiPayment.value.amount
    };

    this.paymentRegiService.postRegiPaymentService(this.regiPaymentObj).subscribe(
      response => {
        console.log('Success!', response);
        this.router.navigate(['./success'], {relativeTo: this.activatedRouter});
      },
      error => {
        this.errorMsg = JSON.parse(error.error)
        console.error('Error!', this.errorMsg.ErrorCode);
        alert(`Can not access server ${this.errorMsg.ErrorCode}`);
      }
    );
  }
  }
}
