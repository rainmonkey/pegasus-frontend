import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserDetailService } from '../../../services/user-detail.service';

import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NgControl, Form } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

import { ILearnerPay, IOtherPay, IcatData } from './learners';

@Component({
  selector: 'app-learner-detail',
  templateUrl: './learner-details.component.html',
  providers: [NgbTabsetConfig],
  styleUrls: ['./learner-details.component.css']
})
export class LearnerDetailsComponent implements OnInit {
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
  public payment = 2;
  public postPayment: ILearnerPay;
  // post other payment
  public otherPaymentObj: IOtherPay;
  public paymentTitle;
  public paymentAmount;
  // products
  public productName: any;
  public types = [];
  public typeItem = [];
  public categories = [];
  public catItem = [];
  public products = [];
  public prodItem = [];
  public prodCatId;
  public prodTypeId: number;
  public productId: string;
  public payProducts = [1];
  public sectionCount = 1;
  public postProdPayObj;
  public addOptionCount = 0;
  public userSelcProd = [];
  public userProd;

  @ViewChild ('productName') ProductName: ElementRef;

  // tabset
  public array = [];
  // product to invoice
  public isCollapsedI = false;
  // others Switch
  public showOthers = false;

  // ng-modal variable
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private _learnersListService: UserDetailService,
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
  // product list fb
  productListForm = this.fb.group({
    productList: this.fb.array([this.productListGroup]),
    });

// other fb
  otherPayment = this.fb.group({
    title: ['', Validators.required],
    amount: ['', Validators.required]
  });
  get title() {
    return this.otherPayment.get('title');
  }
  get amount() {
    return this.otherPayment.get('amount');
  }

  searchForm = this.fb.group({
    search: ['', Validators.required]
  });
  get search() {
    return this.searchForm.get('search');
  }

  invoiceForm = this.fb.group({
    owing: ['', Validators.required]
  });
  get owing() {
    return this.invoiceForm.get('owing');
  }

  ngOnInit() {
    // this.types.push(this.typeItem);
    this.categories.push(this.catItem);
    this.products.push(this.prodItem);
  }

  // bootstrap-modal

  open(content) {
    // search learner
    this._learnersListService
      .getLearners(this.searchForm.value.search)
      .subscribe(data => {
        //return (console.log(data))
        this.learners = data['Data'][0];
        this.data = data['Data'];
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
            // return console.log(dataInvoice)
            this.dataInvoice = dataInvoice;
            this.array = [];
            this.dataInvoice.forEach((item, index) => {
              this.array.push(index);
            });
          });


        // get product data
        this._learnersListService
        .getProdType()
        .subscribe(types => {
        this.typeItem = types['Data'];
        this.types.push(this.typeItem);
        // console.log(this.types[0]['typeItem'])
        // this.types['typeItem'] = types['Data'];
        console.log(this.types)
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
      },err=>console.log(err));
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

  // confirm PRODUCTION selection method
  openProd(contentProd) {
    this.modalService
    .open(contentProd, { ariaLabelledBy: 'modal-basic-title' })
    .result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
        this.postProdPayObj = {
          StaffId: 1,

        };
        // transfer elements from productList to the local userSelcProd
        this.productList.controls.forEach(x => {
          if (!isNaN(Number(x.value.products))) {
          this.userSelcProd.push(Number(x.value.products));
        }
          console.log('x.value.product:', x.value.products);
        });
        // confirm product payment
        this._learnersListService.postProdService(this.postProdPayObj).subscribe(
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
    console.log(this.payment)
  }

  // select product
  get productListGroup(): FormGroup {
    return this.fb.group({
      category: [''],
      types: [''],
      product: [''],
      price: [''],
      index: [0]
    });
  }
  get productList() {
    return this.productListForm.get('productList') as FormArray;
  }
  get arraylist(){
    return this.productListGroup.get('array') as FormArray;
  }

  // return this.productListForm.get('productList') as FormArray;

  addOption() {
    this.catItem=[];
    this.prodItem=[];
    this.productList.push(this.productListGroup);
    this.types.push(this.typeItem);
    this.categories.push(this.catItem);
    this.products.push(this.prodItem);
    console.log(this.categories);
  }
  removeOption(index) {
    const conf = confirm('your selection have not submit, do you still want to delete it?');
    if (conf) {
    this.productList.removeAt(index);}
  }

  selectType(dis, j) {
    //return (console.log(this.types[j]))
    this._learnersListService
    .getProdCat(this.types[j][dis.value].ProdCatId)
    .subscribe(cat => {
      //return console.log(this.categories)
     this.categories[j].catItem = cat['Data'] ;
    // this.productList.controls[j].patchValue({
    //   category: cat['Data'][dis.value].ProdTypeId
    // })
    });
  }
  selectCat(dis, j) {
    this.prodCatId = dis.value;
    this._learnersListService
    .getProdName(this.prodCatId)
    .subscribe(prod => {
    this.products[j].prodItem = prod['Data'];
    });
  }
  selectProd(dis, j) {
    // console.log(this.productListForm.controls.productList)
      this.userProd = this.products[j].prodItem;
      console.log(this.userProd[0]);
      this.productList.controls[j].patchValue({
        product: this.userProd[0].ProductId
      });
      this.productList.controls[j].patchValue({
        price: this.userProd[0].SellPrice
      });
      console.log('this.productList', this.productList);
  }

  getProd(){
    this._learnersListService
        .getProdType()
        .subscribe(types => {
        this.types = types['Data'];
        console.log(types)
        });
  }

// other payment

otherPaymentSubmit() {

  this.otherPaymentObj = {
    StaffId: 1,
    LearnerId: this.learnerId,
    title: this.otherPayment.value.title,
    amount: this.otherPayment.value.amount

  };

  this._learnersListService.postPaymentService(this.otherPaymentObj).subscribe(
    response => {
    console.log('Success!', response);
  },
  error => {
    console.error('Error!', error);
    alert(`Can not access server ${error}`);
  }
);
}

}


