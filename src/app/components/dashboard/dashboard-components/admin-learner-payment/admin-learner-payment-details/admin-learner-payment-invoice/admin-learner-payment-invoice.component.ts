import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaymentService } from '../../../../../../services/http/payment.service';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NgControl, Form } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ILearnerPay, IOtherPay, IcatData } from './learners';

@Component({
  selector: 'app-admin-learner-payment-invoice',
  templateUrl: './admin-learner-payment-invoice.component.html',
  styleUrls: ['./admin-learner-payment-invoice.component.css']
})
export class AdminLearnerPaymentInvoiceComponent implements OnInit {
  // invoice
  public dataInvoice: any;
  public learnerId: any;
  public addFund;
  // post payment
  public payment = 2;
  public postPayment: ILearnerPay;
  // tabset
  public array = [];
  // ng-modal variable
  closeResult: string;

  invoiceForm = this.fb.group({
    owing: ['', Validators.required]
  });
  get owing() {
    return this.invoiceForm.get('owing');
  }

    constructor(
    private modalService: NgbModal,
    private paymentsListService: PaymentService,
    private fb: FormBuilder,
    config: NgbTabsetConfig
  ) {
    // bootstrap tabset
    config.justify = 'center';
    config.type = 'pills';
  }

  // form-builder
  // learners information
  registrationFormL = this.fb.group({
    learnerId: [''],
    learnerName: [{ value: null, disabled: true }],
    lastName: [{ value: null, disabled: true }],
    middleName: [{ value: null, disabled: true }],
    age: [''],
    email: [{ value: null, disabled: true }],
    phone: [{ value: null, disabled: true }],
    payment: [''],
    schedule: [''],
    owning: [''],
    address: ['']
  });

// put service method
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
    // select payment method

    paymentMethod(method) {
      this.payment = method.value;
    }

    // confirm payment open method
    openP(contentP, item) {
      this.addFund = this.invoiceForm.value.owing;
      this.modalService
        .open(contentP, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          result => {
            this.closeResult = `Closed with: ${result}`;
            this.postPayment = {
              StaffId: 1,
              LearnerId: item.LearnerId,
              InvoiceId: item.InvoiceId,
              PaymentMethod: this.payment,
              Amount: this.invoiceForm.value.owing
            };

            this.paymentsListService.addFund(this.postPayment).subscribe(
              response => {
                console.log('Success!', response);
              },
              error => {
                console.error('Error!', error);
                alert(`Can not get data from server ${error}`);
              }
            );
          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }

  ngOnInit() {
  }

}
