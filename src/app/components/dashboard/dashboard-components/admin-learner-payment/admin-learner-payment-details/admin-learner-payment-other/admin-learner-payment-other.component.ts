import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NgControl, Form } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

import { ILearnerPay, IOtherPay, IcatData } from './learners';
import { ProductsService } from 'src/app/services/http/products.service';

@Component({
  selector: 'app-admin-learner-payment-other',
  templateUrl: './admin-learner-payment-other.component.html',
  styleUrls: ['./admin-learner-payment-other.component.css']
})
export class AdminLearnerPaymentOtherComponent implements OnInit {
  // post other payment
  public otherPaymentObj: IOtherPay;
  public paymentTitle;
  public paymentAmount;
  constructor() { }

  ngOnInit() {
  }

}
