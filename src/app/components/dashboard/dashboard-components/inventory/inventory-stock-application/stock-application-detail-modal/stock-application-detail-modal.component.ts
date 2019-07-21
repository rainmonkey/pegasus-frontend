import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup, FormArray } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { PostProduct } from 'src/app/models/ApplyProduct';
import { ProductIdQty } from 'src/app/models/ProductIdQty';

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
  public products: any[] = [];
  public getPostProduct: PostProduct;
  public errorMessage: string;
  
  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.getLocalStorage();
    this.getProdCats(0);
    this.applicationFrom = this.fb.group(this.formGroupAssemble());
  }
  
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
      appliedQty: [null, Validators.required]
    })
  }
  get productIdQty() {
    return this.applicationFrom.get('productIdQty') as FormArray;
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
        console.log('prodCat', i, this.prodCats[i])
      },
      err => this.errHandler(err)
    )
  }
  getProdTypeByCat(cateId: number, i: number) {
    this.inventoriesService.getProdTypeByCat(cateId).subscribe(
      res => {
        this.prodTypes[i] = res['Data'][0].ProdType;
        // console.log('prodTypes', i, this.prodTypes[i])
      },
      err => this.errHandler(err)
    )
  }
  getProdByType(typeId: number, i) {
    this.inventoriesService.getProdByType(typeId).subscribe(
      res => {
        this.products[i] = res['Data'];
        // console.log('prod', i, this.products[i])
      },
      err => this.errHandler(err)
    )
  }
  /* event form HTML */
  deleteForm(i: number) {
    this.productIdQty.removeAt(i);
    console.log('delete', i, this.productIdQty.value)
  }
  addProds(): void {
    // this.prodTypes.push([]);
    // console.log('addProds', this.productIdQty.length, this.productIdQty);
    let i = this.productIdQty.length;
    this.getProdCats(i);
    this.productIdQty.push(this.createProd());
    console.log('number value', this.productIdQty.at(0).value.appliedQty)
  }
  //////////////////////////////////////// post //////////////////////////////////////////////
  dataToPost(): PostProduct {
    let applyReason = this.applicationFrom.get('applyReason').value;
    let productDetail: Array<ProductIdQty> = [];
    for(let prod of this.productIdQty.value) {
      let productId = prod.prod;
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
    this.postProduct()
  }
 
}
