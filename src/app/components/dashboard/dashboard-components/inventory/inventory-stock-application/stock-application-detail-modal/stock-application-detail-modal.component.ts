import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup, FormArray } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { PostProduct } from 'src/app/models/PostProduct';
import { ProductIdQty } from 'src/app/models/ProductIdQty';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-stock-application-detail-modal',
  templateUrl: './stock-application-detail-modal.component.html',
  styleUrls: ['./stock-application-detail-modal.component.css']
})
export class StockApplicationDetailModalComponent implements OnInit {
  // @Input() name;

  public applicationFrom: FormGroup;
  /* for modal */
  public orgId: number;
  public orgName: string;
  public staffId: number;
  public staffName: string;
  public prodCats: any[] = [];
  public prodTypes: any[] = [];
  public prodNames: any[] = [];
  public getPostProduct: PostProduct;
  public errorMessage: string;
  public isDeleted: boolean[] = [];

  constructor(private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.getLocalStorage();
    this.getProdCats(0);
    console.log('isDelete', this.isDeleted)
    this.isDeleted[0] = true;
    this.applicationFrom = this.fb.group(this.formGroupAssemble());
    console.log('prod type', this.prodTypes, 'prod name', this.prodNames)
  }
  /* get form control method */
  get applyReason() { return this.applicationFrom.get('applyReason') }
  get productIdQty() { return this.applicationFrom.get('productIdQty') as FormArray }
  // get appliedQty() { return this.productIdQty.get('appliedQty') }

  /* form group obj */
  formGroupAssemble() {
    return {
      applyReason: ['', Validators.required],
      productIdQty: this.fb.array([this.createProd()])
    }
  }
  /* get productIdQty: FormArray */
  createProd(): FormGroup {
    return this.fb.group({
      prodCat: ['', Validators.required],
      prodType: ['', Validators.required],
      prod: ['', Validators.required],
      appliedQty: [0, [Validators.required, Validators.pattern('[0-9]*')]]
    })
  }

  /* get data from local storage */
  getLocalStorage() {
    let orgIdArr = localStorage.getItem('staffId');
    this.orgId = parseInt(orgIdArr[0]);
    this.orgName = localStorage.getItem('organisations');
    this.staffId = parseInt(localStorage.getItem('staffId'));
    this.staffName = localStorage.getItem('userFirstName');
  }
  /* get data from server */
  errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) {
      this.errorMessage = err.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can Not Catch Data!';
    }
  }
  getProdCats(i: number) {
    this.inventoriesService.getProdCats().subscribe(
      res => {
        this.prodCats[i] = res['Data']
        // console.log('prodCat', i, this.prodCats[i])
      },
      err => this.errHandler(err)
    )
  }
  getProdTypeByCat(cateId: number, i: number) {
    this.inventoriesService.getProdTypeByCat(cateId).subscribe(
      res => {
        this.prodTypes[i] = res['Data'][0].ProdType;
        console.log('prodTypes', i, this.prodTypes)
      },
      err => this.errHandler(err)
    )
  }
  getProdByType(typeId: number, i) {
    this.inventoriesService.getProdByType(typeId).subscribe(
      res => {
        this.prodNames[i] = res['Data'];
        console.log('prodName', i, this.prodNames)
      },
      err => this.errHandler(err)
    )
  }
  /* event form HTML */
  deleteForm(i: number) {
    this.prodTypes.splice(i, 1);
    this.prodNames.splice(i, 1)
    console.log('delete prodTypes', i, this.prodTypes, 'delete prodNames', this.prodNames)
    this.productIdQty.removeAt(i);
    let prodLength = this.productIdQty.length;
    if (prodLength == 1) {
      for (let i in this.productIdQty.value) {
        console.log('i', i)
        this.isDeleted[i] = true;
      }
    }
  }
  addNewProd(): void {
    let prodLength = this.productIdQty.length;
    console.log('prodLength', prodLength);
    this.getProdCats(prodLength);
    this.productIdQty.push(this.createProd());
    console.log('add productIdQty',this.productIdQty, this.checkProductIdQty() )
    // this.checkProductIdQty()
    if (prodLength > 1 || prodLength == 1) {
      for (let i in this.productIdQty.value) {
        console.log('i', i)
        this.isDeleted[i] = false;
      }
    }
    // console.log('add prodTypes', i, this.prodTypes, 'add prodNames', this.prodNames)
  }

  // post product 
  dataToPost(): PostProduct {
    let applyReason = this.applicationFrom.get('applyReason').value;
    let productDetail: Array<ProductIdQty> = [];
    for (let prod of this.productIdQty.value) {
      let productId = Number(prod.prod);
      let appliedQty = prod.appliedQty;
      let productIdQty = new ProductIdQty(productId, appliedQty);
      productDetail.push(productIdQty);
    }
    let postProduct = new PostProduct(this.orgId, this.staffId, applyReason, productDetail);
    console.log('dataToPost', postProduct)
    return postProduct;
  }
  postProduct() {
    this.inventoriesService.postProduct(this.dataToPost()).subscribe(
      res => {
        this.getPostProduct = res;
        console.log('postdata', res)
      },
      err => this.errHandler(err)
    )
  }
  submitOrder() {
    this.checkInputValue();
    // this.postProduct()
  }
  /* algorithm for add or minus prod number */
  minusProd(i: number) {
    let appliedQty = this.productIdQty.controls[i].get('appliedQty');
    let currentNumber = parseInt(appliedQty.value);
    let minusNumber = currentNumber - 1;
    appliedQty.setValue(minusNumber);
    //  console.log('minusNumber', minusNumber)  
  }
  increaseProd(i: number) {
    let appliedQty = this.productIdQty.controls[i].get('appliedQty');
    let currentNumber = parseInt(appliedQty.value);
    let increaseNumber = currentNumber + 1;
    appliedQty.setValue(increaseNumber);
    //  console.log('increaseNumber', increaseNumber)
  }
  /* check whether data valid or not (ruled by Validators) */
  checkInputValue() {
    if(this.applicationFrom.status == 'INVALID') {
      if(this.checkAppliedQty() && this.checkProductIdQty()) {
        console.log('please check your input')
      }
    }
    
    // for (let i of this.applicationFrom.controls) {
    //   console.log('check', i)
    // }
  }
  checkAppliedQty() {
    console.log('checkAppliedQty', this.applicationFrom)
    if(this.applyReason.status == "INVALID") {
      return true
    } else {
      return false
    }
  }
  checkProductIdQty() {
    console.log('checkProductIdQty', this.productIdQty)
    if(this.productIdQty.status == "INVALID") {
      for(let prod of this.productIdQty.controls) {
        if(prod.status == "INVALID") {
          return true
        }
      }
    }
  }
}
