import { Component, OnInit, Input } from "@angular/core";
import { LearnersListService } from "./learners-list.service";

import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

import { ILearnerPay } from './learners';

@Component({
  selector: 'app-learner-detail',
  templateUrl: './learner-details.component.html',
  providers: [NgbTabsetConfig],
  styleUrls: ['./learner-details.component.css']
})
export class LearnerDetailsComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    // tslint:disable-next-line:variable-name
    private _learnersListService: LearnersListService,
    private fb: FormBuilder,
    config: NgbTabsetConfig
  ) {
    // bootstrap tabset
    config.justify = 'center';
    config.type = 'pills';
  }
  get search() {
    return this.searchForm.get('search');
  }
  get owing() {
    return this.invoiceForm.get('owing');
  }
  a = false;
  // learners
  public name: any = 'type..';
  public learners: any;
  public data: any;
  public show: boolean;

  // invoice

  public dataInvoice: any;

  public learnerId: any;
  public addFund;
  // post payment
  public payment = 'Eftpos';
  public postPayment: ILearnerPay;
  // products
  public productName: any;
  public categories = [];
  // public productsT:[''];

  // tabset
  public array = [];
  public isCollapsedI = false;

  // others Switch
  public showOthers = false;

  // ng-modal variable
  closeResult: string;

  // form-builder
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

  searchForm = this.fb.group({
    search: ['', Validators.required]
  });

  invoiceForm = this.fb.group({
    owing: ['', Validators.required]
  });

  // products

  // registrationFormP = this.fb.group({
  //   Guitar: [''],
  //   Piano: [''],
  //   Drum: ['']
  // });

  ngOnInit() {}

  // bootstrap-modal

  open(content) {
    // search learner
    this._learnersListService
      .getLearners(this.searchForm.value.search)
      .subscribe(data => {
        this.learners = data[0];
        this.data = data;
        this.registrationFormL.patchValue({
          learnerId: this.learners.LearnerId,
          learnerName: this.learners.FirstName,
          lastName: this.learners.LastName,
          email: this.learners.Email,
          phone: this.learners.ContactNum,
          address: this.learners.Address
        });
        // get invoice
        this._learnersListService
          .getInvoice(this.learners.LearnerId)
          .subscribe(dataInvoice => {
            this.dataInvoice = dataInvoice;
            this.array = [];
            this.dataInvoice.forEach((item, index) => {
              this.array.push(index);
            });
          });

        if (data.length > 1) {
          this.show = true;
        } else {
          this.show = false;
        }

        if (this.show) {
          this.modalService
            .open(content, { ariaLabelledBy: 'modal-basic-title' })
            .result.then(
              result => {
                this.closeResult = `Closed with: ${result}`;
              },
              reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              }
            );
        }
      });
  }

  // middle name method

  selectChange(dis) {
    const i: number = dis.value;
    if (!isNaN(Number(i))) {
      this.registrationFormL.patchValue({
        learnerId: this.data[i].LearnerId,
        learnerName: this.data[i].FirstName,
        lastName: this.data[i].LastName,
        email: this.data[i].Email,
        phone: this.data[i].ContactNum
      });
      this._learnersListService
        .getInvoice(this.data[i].LearnerId)
        .subscribe(dataInvoice => {
          this.dataInvoice = dataInvoice;
          this.array = [];
          this.dataInvoice.forEach((item, index) => {
            this.array.push(index);
          });
        });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
          console.log(this.postPayment);

          this._learnersListService.addFund(this.postPayment).subscribe(
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
  // select payment method

  paymentMethod(method) {
    this.payment = method.value;
  }

  // select product

  selectCategory(pro) {
    this.productName = pro.value;
    console.log(this.productName);
  }
}
