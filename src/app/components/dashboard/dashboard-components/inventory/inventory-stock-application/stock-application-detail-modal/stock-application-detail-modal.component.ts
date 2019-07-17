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
  public productIdQty: FormArray;
  /* for modal */
  public orgId: number;
  public orgName: string;
  public staffId: number;
  public staffName: string;
  public prodCats: any[];
  public prodTypes: any[];
  public products: any[];
  public errorMessage: any;
  

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
  /* productIdQty: FormArray */
  createProd(): FormGroup {
    return this.fb.group({
      prodCat: ['', Validators.required],
      prodType: ['', Validators.required],
      prod: ['', Validators.required],
      appliedQty: [null, Validators.required]
    })
  }
  addProds(): void {
    this.productIdQty = this.applicationFrom.get('productIdQty') as FormArray;
    this.productIdQty.push(this.createProd());
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
    this.inventoriesService.getProdCats().subscribe(
      res => {
        console.log('prodCats', res['Data'])
        this.prodCats = res['Data']
      },
      err => this.errHandler(err)
    )
  }
  getProdTypeByCat(cateId: number) {
    this.inventoriesService.getProdTypeByCat(cateId).subscribe(
      res => {
        console.log('prodTypes', res['Data'][0]['ProdType'])
        this.prodTypes = res['Data'][0].ProdType;
      },
      err => this.errHandler(err)
    )
  }
  getProdByType(typeId: number) {
    this.inventoriesService.getProdByType(typeId).subscribe(
      res => {
        console.log('prod', res['Data'])
        this.products = res.Data;
      },
      err => this.errHandler(err)
    )
  }
  /* event form HTML */
  resetForm(i: number) {
    this.applicationFrom.reset(i);
  }
  deleteForm(i: number) {
    this.productIdQty.removeAt(i);
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
