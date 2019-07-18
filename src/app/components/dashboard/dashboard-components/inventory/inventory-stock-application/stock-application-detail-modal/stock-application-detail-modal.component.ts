import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup, FormArray } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service'

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
  public errorMessage: any;
  public previousI: number = null;
  

  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.getLocalStorage();
    this.getProdCats();
    // this.getProducts();
    // this.getProdByType(1);
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
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can Not Catch Data!';
    }
  }
  getProdCats() {
    // this.previousI = i;
    // console.log('previousI', i,this.previousI );

    this.inventoriesService.getProdCats().subscribe(
      res => {
        // let tempProdCats = [];
        // tempProdCats = res['Data'];
        // this.prodCats.push(tempProdCats)
        // console.log('prodCats', this.prodCats)
        this.prodCats = res['Data']
      },
      err => this.errHandler(err)
    )
  }
  getProdTypeByCat(cateId: number, i) {
    this.inventoriesService.getProdTypeByCat(cateId).subscribe(
      res => {
        // console.log('prodTypes', res['Data'][0]['ProdType'])
        // let tempProdTypes = [];
        // tempProdTypes = res['Data'][0].ProdType;
        // this.prodTypes.push(tempProdTypes);
        // console.log('prodTypes', this.prodTypes)
        this.prodTypes = res['Data'][0].ProdType;
      },
      err => this.errHandler(err)
    )
  }
  getProdByType(typeId: number) {
    this.inventoriesService.getProdByType(typeId).subscribe(
      res => {
        // console.log('prod', res['Data'])
        // let tempProducts = res['Data'];
        // this.products.push(tempProducts);
        // console.log('prod', this.products)
        this.products = res['Data'];
      },
      err => this.errHandler(err)
    )
  }
  /* event form HTML */
  deleteForm(i: number) {
    this.productIdQty.removeAt(i);
    console.log('delete', i, this.productIdQty.value)
  }
  addProds(i): void {
    this.previousI = i;
    let tempObj = {};
    tempObj['cate'] = this.prodCats;
    tempObj['type'] = this.prodTypes;
    tempObj['prod'] = this.products;
    let tempProductIdQty = [];
    tempProductIdQty.push(tempObj)
    // this.productIdQty.push(this.createProd());
    // tempProductIdQty.push(this.productIdQty)
    this.productIdQty.push(this.createProd());
    console.log('add', tempProductIdQty)
  }
  resetForm(i: number) {
    // this.productIdQty[i].reset([]);
    // this.productIdQty.controls[i]
    this.productIdQty.controls[i].value.prodCat=""
    // this.productIdQty.setValue([
    //   {
    //     prodCat: '',
    //     prodType: '',
    //     prod: '',
    //     appliedQty: ''
    //   },
    //   {
    //     prodCat: '',
    //     prodType: '',
    //     prod: '',
    //     appliedQty: ''
    //   },
    // ]);
    console.log('reset', i, this.productIdQty.value,this.productIdQty.value[i])
    // console.log('reset form', this.createProd())
  }
  // getProducts() {
  //   this.inventoriesService.getProdts().subscribe(
  //     res => {
  //       console.log('prods', res['Data'])
  //       res['Data'].map((prod) => {
  //         // this.prodCats = prod.prodType
  //       })
  //     },
  //     err => this.errHandler(err)
  //   ) 
  // }
 
}
