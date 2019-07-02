import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl
} from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { ProductsService } from "src/app/services/http/products.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
@Component({
  selector: "app-admin-learner-payment-products",
  templateUrl: "./admin-learner-payment-products.component.html",
  styleUrls: ["./admin-learner-payment-products.component.css"]
})
export class AdminLearnerPaymentProductsComponent implements OnInit {
  // learner
  public learnerId;
  // products
  public productName: any;
  public types = [];
  public typeItem = [];
  public categories = [];
  public catItem = [];
  public prodMuti = [];
  public prods = [];
  public prodItems = [];
  public prodItem = [];
  public prodCatId;
  public prodTypeId: number;
  public productId;
  public payProducts = [1];
  public sectionCount = 1;
  public postProdPayObj;
  public addOptionCount = 0;
  public userSelcProd = [];
  public userProd;
  public sellPrice = 0;
  public sellPriceTemp = 0;
  public sellSubtotal = 0;
  public sellPriceArr = [];
  public postProdsIdArray = [];
  public checkRate = true;
  public checkMoney = true;
  public fd = new FormData ();
  public showErrMsg = false;
  public showErrMsgSub = false;
  public errorMsg;
  public payPath;
  // ng-modal variable
  closeResult: string;
  // ng-alert
  public successAlert = false;
  public errorAlert = false;
  public errMsgP = false;
  public errMsgO = false;

  constructor(
    private modalService: NgbModal,
    private productsListService: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    config: NgbTabsetConfig
  ) {
    // bootstrap tabset
    config.justify = "center";
    config.type = "pills";
  }

  // product list fb
  productListForm = this.fb.group({
    productList: this.fb.array([this.productListGroup]),
    amount: [],
    paymentMethod: [, Validators.required]
  });
  get paymentMethod(){
    return this.productListForm.get('paymentMethod')
  }
  // post products to server
  postPordPayObjMethod() {
    this.postProdPayObj = {
      PaymentMethod: this.productListForm.value.paymentMethod,
      StaffId: Number(localStorage.getItem('staffId')),
      OrgId: Number(localStorage.getItem('organisations')),
      Amount: this.sellPrice,
      LearnerId: this.learnerId,
      SoldTransaction: this.postProdsIdArray
    };
  }
  getProductId() {
    this.productList.controls.forEach(controls => {
      return this.postProdsIdArray.push({
        ProductId: controls.value.product,
        SoldQuantity: controls.value.number,
        DiscountAmount: controls.value.subMoney ? controls.value.subMoney : 0,
        DiscountRate: (controls.value.rate ? controls.value.rate : 100) / 100,
      });
    });
  }

  // modal method
  openProd(contentProd) {
    this.modalService
      .open(contentProd, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.getProductId();
          this.postPordPayObjMethod();
          // confirm product payment
          this.fd.append('paymentTranList', JSON.stringify(this.postProdPayObj));
        //  return console.log(this.fd);
          this.productsListService
            .postProdService(this.fd)
            .subscribe(
              response => {
                console.log("Success!", response);
                this.successAlert = true;
                this.router.navigate(['../success'],{relativeTo: this.activatedRouter});
              },
              error => {
                this.errorMsg = JSON.parse(error.error);
                console.log("Error!", this.errorMsg.ErrorCode);
                this.errorAlert = true;
              }
            );
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

    // isAllInputsFilled() {
    //   //once user click save btn, touch all inputs form with for-loop, in orde to trigger Validator
    //   for (let j in this.modalUpdateFormComponentObj.updateForm.controls) {
    //     this.modalUpdateFormComponentObj.updateForm.controls[j].touched = true;
    //     console.log(this.modalUpdateFormComponentObj.updateForm.controls[j])
    //   }
  //validation method
  validMethod(contentProd) {
    // read-only
    // this.productListForm.controls[0].touched = true;
    // this.paymentMethod.errors.invalid = true;
    // this.paymentMethod.errors.touched = true;
    if (this.productListForm.invalid) {
      this.showErrMsg = true;
      if(this.paymentMethod.invalid){this.errMsgP = true;}
    } else if (!this.showErrMsgSub) {
      this.openProd(contentProd);
    }
  }
  // put to service
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // select product
  get productListGroup(): FormGroup {
    return this.fb.group({
      category: [null,[Validators.required,Validators.pattern('^[0-9]*$')] ],
      type: [null,[Validators.required,Validators.pattern('^[0-9]*$')]],
      product: [null,[Validators.required,Validators.pattern('^[0-9]*$')]],
      productName: [""],
      price: [],
      number: [1],
      index: [0],
      subTotal: [0],
      rate: new FormControl({ value: 100, disabled: false }),
      subMoney: new FormControl({ value: 0, disabled: true })
    });
  }

  // short hand of form group items
  get productList() {
    return this.productListForm.get("productList") as FormArray;
  }

  checkRateClick(j) {
    // console.log(this.productList.controls);
    this.productList.controls[j].patchValue({
      rate: 100,
      subMoney: 0
    });
    // console.log(this.productListGroup.controls);
    this.productList.controls[j]['controls'].rate.enable();
    this.productList.controls[j]['controls'].subMoney.disable();
    this.changeProductPrice();
    }
  // single option for rate or money
  checkMoneyClick(j) {
    this.productList.controls[j].patchValue({
      rate: 100,
      subMoney: 0
    });
    this.productList.controls[j]['controls'].subMoney.enable();
    this.productList.controls[j]['controls'].rate.disable();
    this.changeProductPrice();
  }
  // add more section
  addOption() {
    this.catItem = [];
    this.prods = [];
    this.prodItem = [];
    this.productList.push(this.productListGroup);
    this.types.push(this.typeItem);
    this.categories.push(this.catItem);
    this.prodMuti.push(this.prods);
    this.prodItems.push(this.prodItem);
  }
  // delete more section
  removeOption(index, confirmModal) {
    this.modalService
    .open(confirmModal)
    .result.then(
      result => {
      this.productList.removeAt(index);
      this.types.splice(index, 1);
      this.categories.splice(index, 1);
      this.prodMuti.splice(index, 1);
      this.prodItems.splice(index, 1);
      this.changeProductPrice();
      });
  }
  // select payment method
  changePayment(){
    this.errMsgP = false;
  }
  // user select type
  selectType(dis, j) {
    this.emptyProductList(j);
    this.productsListService
      .getProdCat(dis.value)
      .subscribe(cat => {
        this.categories[j].catItem = cat["Data"][0]['ProdType'];
      });
  }
  // user select category
  selectCat(dis, j) {
    this.emptyProductList(j);
    this.prodCatId = dis.value;
    this.productsListService
    .getProdName(this.prodCatId)
    .subscribe(prod => {
      this.prodMuti[j].prods = prod["Data"];
    });
  }
  // user select product
  selectProd(dis, j) {
    this.productsListService
    .getProdItem(dis.value)
    .subscribe(item => {
      this.prodItems[j].prodItem = [];
      this.prodItems[j].prodItem = item["Data"];
      this.patchProductItems(j);
      this.changeProductPrice();
    });
  }
  // patch value to form group
  patchProductItems(j){
    this.productList.controls[j].patchValue({
      product: this.prodItems[j].prodItem[0].ProductId
    });
    this.productList.controls[j].patchValue({
      price: this.prodItems[j].prodItem[0].SellPrice
    });
    this.productList.controls[j].patchValue({
      productName: this.prodItems[j].prodItem[0].ProductName
    });
  }

  // clear the productList Array if users search new name
  emptyProductList(j){
    this.prodItems[j].prodItem = [];
    this.productList.controls[j].patchValue({
      product: null
    });
    this.productList.controls[j].patchValue({
      price: null
    });
    this.productList.controls[j].patchValue({
      productName: null
    });
    this.changeProductPrice();
  }

  // price showing
  changeProductPrice() {
    this.sellPrice = 0;
    this.productList.controls.forEach((item, i) => {
      if (item.value.rate === undefined) {
        item.value.rate = 100;
      }
      if (item.value.subMoney === undefined) {
        item.value.subMoney = 0;
      }
      this.sellPriceTemp =
        ((item.value.price * Number(item.value.rate)) / 100) *
          item.value.number -
        item.value.subMoney;
      this.sellSubtotal = Math.round(this.sellPriceTemp * 100) / 100;
      this.sellPrice = this.sellSubtotal + this.sellPrice;
      this.productList.controls[i].patchValue({
        subTotal: this.sellSubtotal < 0 ? 0 : this.sellSubtotal
      });
      if (this.productList.controls[i].value.subTotal < this.productList.controls[i].value.subMoney || this.sellPrice < 0)
      {this.showErrMsgSub = true;} else {this.showErrMsgSub = false;}
    });
  }

  // search new users patch new data (3)
  patchProd() {
    this.errMsgP = false;
    this.showErrMsgSub = false;
    this.showErrMsg = false;
    this.showErrMsgSub = false;
    this.productList.controls.forEach((item, index) => {
      this.productList.removeAt(index);
    });
    this.productList.push(this.productListGroup);
    this.productListForm.patchValue({
      paymentMethod: null
    });
  }

  // close alert
  closeSucc(){
    this.successAlert = false;
  }
  closeErro(){
    this.errorAlert = false;
  }

  compareFn(c1,c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  // reload   (1)
  ngOnInit() {
    // init framework of the user interface
    this.categories.push(this.catItem);
    this.prodMuti.push(this.prods);
    this.prodItems.push(this.prodItem);

    this.activatedRouter.paramMap
    .subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
      this.patchProd();
      this.errMsgP = false;
      console.log(this.errMsgP)
    });
    // init types instance of the user interface, waiting select (2)
    this.productsListService.getProdType().subscribe(types => {
      this.typeItem = types["Data"];
      this.types.push(this.typeItem);
    });
  }
}
