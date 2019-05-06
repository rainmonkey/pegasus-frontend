import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from 'src/app/services/http/products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-admin-learner-payment-products',
  templateUrl: './admin-learner-payment-products.component.html',
  styleUrls: ['./admin-learner-payment-products.component.css']
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
  public sellPriceArr = [];
  public postProdsIdArray = [];
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
    config.justify = 'center';
    config.type = 'pills';
  }

  // product list fb
  productListForm = this.fb.group({
    productList: this.fb.array([this.productListGroup]),
    amount: []
    });
  postPordPayObjMethod() {
    this.postProdPayObj = {
      StaffId: 1,
      BranchId: 1,
      LearnerId: this.learnerId,
      Products: this.postProdsIdArray
    };
  }
  transferFromProdToLocalMethod() {
    // transfer elements from productList to the local userSelcProd
    this.productList.controls.forEach(x => {
      if (!isNaN(Number(x.value.products))) {
        this.userSelcProd.push(Number(x.value.products));
      }
      console.log('x.value.product:', x.value.products);
    });
  }

    // confirm PRODUCTION selection method
    openProd(contentProd) {
      this.modalService
        .open(contentProd, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          result => {
            this.closeResult = `Closed with: ${result}`;
            this.getProductId();
            this.postPordPayObjMethod();
            this.transferFromProdToLocalMethod();
            // confirm product payment
            this.productsListService.postProdService(this.postProdPayObj).subscribe(
              response => {
                console.log('Success!', response);
                alert('Your Payment Has Been Uploaded.');
              },
              (error) => {
                const errorMsg = JSON.parse(error.error);
                console.log('Error!', errorMsg.ErrorCode);
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
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

    // select product
    get productListGroup(): FormGroup {
      return this.fb.group({
        category: [''],
        types: [''],
        product: [''],
        productName: [''],
        price: [''],
        number: [1],
        index: [0],
        rate: [100],
        subMoney: [0],
        subTotal: [0]
      });
    }
    get productList() {
      return this.productListForm.get('productList') as FormArray;
    }
    // get arraylist(){
    //   return this.productListGroup.get('array') as FormArray;
    // }

    // return this.productListForm.get('productList') as FormArray;

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
      const conf = confirm('your selection have not submit, do you still want to delete it?');
      if (conf) {
      // console.log(this.prodItems[index]);
      // this.sellPrice = this.sellPrice - Number(this.prodItems[index].prodItem[0].SellPrice) * this.productList.controls[index].value.number;
      // this.sellPriceArr.splice(index, 1);
      this.changeProductPrice(index);

      this.productList.removeAt(index);
      this.types.splice(index, 1);
      this.categories.splice(index, 1);
      this.prodMuti.splice(index, 1);
      this.prodItems.splice(index, 1);
      }
    }

    selectType(dis, j) {
      // console.log(this.prodMuti[j].prods,'this.prodMuti',this.prodMuti)
      this.productsListService
      .getProdCat(this.types[j][dis.value].ProdCatId)
      .subscribe(cat => {
        // return console.log(this.categories)
       this.categories[j].catItem = cat['Data'] ;
       console.log(cat['Data']);
      // this.productList.controls[j].patchValue({
      //   category: cat['Data'][dis.value].ProdTypeId
      // })
      });
    }
    selectCat(dis, j) {
      this.prodCatId = dis.value;
      this.productsListService
      .getProdName(this.prodCatId)
      .subscribe(prod => {
      this.prodMuti[j].prods = prod['Data'];
      });
    }
    selectProd(dis, j) {
       // console.log(this.prodMuti[j].prods[dis.value].ProductId)
        this.productId = this.prodMuti[j].prods[dis.value].ProductId;
        this.productsListService
        .getProdItem(this.productId)
        .subscribe(item => {
          this.prodItems[j].prodItem = item['Data'];
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
          this.changeProductPrice(j);
      });
    }

    getProductId() {
      this.productList.controls.forEach(controls => {
        console.log(controls.value.product);
        return this.postProdsIdArray.push(controls.value.product);

      });
      console.log(this.postProdsIdArray);
    }

  // changeProductPrice(j) {
  //   // this.sellPriceArr.splice(j, 1);
  //   this.sellPriceArr.push(Number(this.prodItems[j].prodItem[0].SellPrice) * this.productList.controls[j].value.number - this.productList.controls[j].value.subMoney);
  //   console.log(this.sellPriceArr);
  //   this.sellPriceTemp = this.sellPriceArr.reduce((sum, price) => {
  //     return sum + price;
  //   }, 0) * this.productList.controls[j].value.rate / 100 ;
  //   this.sellPrice = Math.round(this.sellPriceTemp * 100) / 100;
  // }
  changeProductPrice(j) {
    this.sellPrice = 0;
    this.productList.controls.forEach((item) => {
        this.sellPriceTemp = item.value.price * Number(item.value.rate) / 100 * item.value.number - item.value.subMoney;
        console.log(Number(item.value.rate));
        this.sellPrice = Math.round(this.sellPriceTemp * 100) / 100 + this.sellPrice;
      });
      this.productList.controls[j].patchValue({
        subTotal: this.sellPriceTemp
      })
  }

  ngOnInit() {
    this.categories.push(this.catItem);
    this.prodMuti.push(this.prods);
    this.prodItems.push(this.prodItem);

    this.route.paramMap.subscribe((obs: ParamMap) => {
      this.learnerId = parseInt(obs.get('id'));
    });

    this.productsListService
    .getProdType()
    .subscribe(types => {
      this.typeItem = types['Data'];
      this.types.push(this.typeItem);
      // console.log(this.types[0]['typeItem'])
      // this.types['typeItem'] = types['Data'];
      console.log(this.types);
    });
  }

}
