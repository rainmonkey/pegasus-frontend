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
import { ActivatedRoute, ParamMap } from "@angular/router";
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
  // ng-modal variable
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private productsListService: ProductsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
    paymentMethod: 1
  });
  postPordPayObjMethod() {
    this.postProdPayObj = {
      PaymentMethod: this.productListForm.value.paymentMethod,
      StaffId: 1,
      OrgId: 1,
      Amout: this.sellPrice,
      LearnerId: this.learnerId,
      SoldTransaction: this.postProdsIdArray
    };
  }
  transferFromProdToLocalMethod() {
    // transfer elements from productList to the local userSelcProd
    this.productList.controls.forEach(x => {
      if (!isNaN(Number(x.value.products))) {
        this.userSelcProd.push(Number(x.value.products));
      }
      console.log("x.value.product:", x.value.products);
    });
  }

  // this.fd.append('details', JSON.stringify(this.fdObj));
  // confirm PRODUCTION selection method
  openProd(contentProd) {
    this.modalService
      .open(contentProd, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
          this.getProductId();
          this.postPordPayObjMethod();
          this.transferFromProdToLocalMethod();
          // confirm product payment
          this.productsListService
            .postProdService(this.postProdPayObj)
            .subscribe(
              response => {
                console.log("Success!", response);
                alert("Your Payment Has Been Made");
              },
              error => {
                const errorMsg = JSON.parse(error.error);
                console.log("Error!", errorMsg.ErrorCode);
                alert(errorMsg.ErrorCode);
              }
            );
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
      category: [""],
      types: [""],
      product: [""],
      productName: [""],
      price: [""],
      number: [1],
      index: [0],
      subTotal: [0],
      paymentMethod: [1],
      rate: new FormControl({ value: 100, disabled: false }),
      subMoney: new FormControl({ value: 0, disabled: true })
    });
  }

  get productList() {
    return this.productListForm.get("productList") as FormArray;
  }
  // get arraylist(){
  //   return this.productListGroup.get('array') as FormArray;
  // }

  // return this.productListForm.get('productList') as FormArray;

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
    // console.log(this.prodMuti[j].prods,'this.prodMuti',this.prodMuti)
    this.productsListService
      .getProdCat(this.types[j][dis.value].ProdCatId)
      .subscribe(cat => {
        // return console.log(this.categories)
        this.categories[j].catItem = cat["Data"];
        console.log(cat["Data"]);
        // this.productList.controls[j].patchValue({
        //   category: cat['Data'][dis.value].ProdTypeId
        // })
      });
  }
  selectCat(dis, j) {
    this.prodCatId = dis.value;
    this.productsListService.getProdName(this.prodCatId).subscribe(prod => {
      this.prodMuti[j].prods = prod["Data"];
    });
  }
  selectProd(dis, j) {
    // console.log(this.prodMuti[j].prods[dis.value].ProductId)
    this.productId = this.prodMuti[j].prods[dis.value].ProductId;
    this.productsListService.getProdItem(this.productId).subscribe(item => {
      this.prodItems[j].prodItem = item["Data"];
      // this.userProd = this.prodItems[j].prodItem;
      this.productList.controls[j].patchValue({
        product: this.prodItems[j].prodItem[0].ProductId
      });
      this.productList.controls[j].patchValue({
        price: this.prodItems[j].prodItem[0].SellPrice
      });
      this.productList.controls[j].patchValue({
        productName: this.prodItems[j].prodItem[0].ProductName
      });
      this.changeProductPrice();
    });
  }

  getProductId() {
    this.productList.controls.forEach(controls => {
      console.log(controls.value.product);
      return this.postProdsIdArray.push([{
        ProductId: controls.value.product,
        SoldQuantity: controls.value.number,
        DiscountAmount: controls.value.subMoney,
        DiscountRate: controls.value.rate / 100,
      }]);
    });
    console.log(this.postProdsIdArray);
  }

  changeProductPrice() {
    this.sellPrice = 0;
    this.productList.controls.forEach((item, i) => {
      console.log(item.value);
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
  patchProd(){
    this.productList.controls.forEach((item, index) => {
      this.productList.removeAt(index);
    });
    this.productList.push(this.productListGroup);
    this.productListForm.value.paymentMethod = 1;
  }
  // reload
  ngOnInit() {
    this.categories.push(this.catItem);
    this.prodMuti.push(this.prods);
    this.prodItems.push(this.prodItem);

    this.route.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get("id"));
      this.patchProd();
    });

    this.productsListService.getProdType().subscribe(types => {
      this.typeItem = types["Data"];
      this.types.push(this.typeItem);
      // console.log(this.types[0]['typeItem'])
      // this.types['typeItem'] = types['Data'];
    });
  }
}
