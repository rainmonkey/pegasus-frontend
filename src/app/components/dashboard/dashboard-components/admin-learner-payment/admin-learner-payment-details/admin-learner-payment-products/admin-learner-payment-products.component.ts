import { Component, OnInit } from "@angular/core";
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
  public fd = new FormData;
  public showErrMsg = false;
  public errorMsg;
  public payPath;
  // ng-modal variable
  closeResult: string;
  // ng-alert
  public successAlert = false;
  public errorAlert = false;
  public errMsgM = false;
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
      StaffId: 1,
      OrgId: 1,
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
          console.log(this.postProdPayObj)
          console.log(JSON.stringify(this.postProdPayObj))
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
                this.errorAlert = false;
              }
            );
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  //validation method
  validMethod(contentProd){
    if (this.productListForm.invalid) {
      this.showErrMsg = true;
    } else {
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
      category: [null,[Validators.required,Validators.pattern('^[0-9]*$')]],
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

  checkMoneyClick(j) {
    this.productList.controls[j].patchValue({
      rate: 100,
      subMoney: 0
    });
    this.productList.controls[j]['controls'].subMoney.enable();
    this.productList.controls[j]['controls'].rate.disable();
    this.changeProductPrice();
  }

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
  removeOption(index) {
    const conf = confirm(
      "your selection have not submit, do you still want to delete it?"
    );
    if (conf) {
      this.productList.removeAt(index);
      this.types.splice(index, 1);
      this.categories.splice(index, 1);
      this.prodMuti.splice(index, 1);
      this.prodItems.splice(index, 1);
      this.changeProductPrice();
    }
  }

  selectType(dis, j) {
    this.emptyProductList(j);
    this.productsListService
      .getProdCat(dis.value)
      .subscribe(cat => {
        this.categories[j].catItem = cat["Data"][0]['ProdType'];
      });
  }
  selectCat(dis, j) {
    this.emptyProductList(j);
    this.prodCatId = dis.value;
    this.productsListService
    .getProdName(this.prodCatId)
    .subscribe(prod => {
      this.prodMuti[j].prods = prod["Data"];
    });
  }
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
        subTotal: this.sellSubtotal
      });
    });
  }
  // search new users patch new data
  patchProd() {
    this.productList.controls.forEach((item, index) => {
      this.productList.removeAt(index);
    });
    this.productList.push(this.productListGroup);
    this.productListForm.value.paymentMethod = 1;
  }

  // close alert
  closeSucc(){
    this.successAlert = false;
  }
  closeErro(){
    this.errorAlert = false;
  }

  // reload
  ngOnInit() {
    this.categories.push(this.catItem);
    this.prodMuti.push(this.prods);
    this.prodItems.push(this.prodItem);

    this.activatedRouter.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
      this.patchProd();
    });

    this.productsListService.getProdType().subscribe(types => {
      this.typeItem = types["Data"];
      this.types.push(this.typeItem);
    });
  }
}
