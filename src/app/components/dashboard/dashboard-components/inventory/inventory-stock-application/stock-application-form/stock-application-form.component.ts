import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup, FormArray } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { PostProduct } from 'src/app/models/PostProduct';
import { ProductIdQty } from 'src/app/models/ProductIdQty';
import { StockApplicationService } from 'src/app/shared/components/stock-application/stock-application.service';
import { getWeeksFromInput } from '@fullcalendar/core/datelib/duration';

@Component({
  selector: 'app-stock-application-form',
  templateUrl: './stock-application-form.component.html',
  styleUrls: ['./stock-application-form.component.css']
})
export class StockApplicationFormComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendApplicationForm = new EventEmitter<any>();

  //readonly or not
  public readonlyFlag: boolean = false;
  public hiddenFlag: boolean = false;
  //loading flag
  public loadingFlag: boolean = false;

  public applicationForm: FormGroup;
  /* for modal */
  public orgId: number;
  public orgName: string;
  public staffId: number;
  public staffName: string;
  public prodCats: any[] = [];
  public prodTypes: any[] = [];
  public prodNames: any[] = [];
  public getPostProduct: any[];
  public errorMessage: string;
  public isDeleted: boolean[] = [];
  public message: string;
 

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private inventoriesService: InventoriesService,
    private stockApplicationService: StockApplicationService) { }

  ngOnInit() {
    this.loadingFlag = true;
    console.log('command', this.command, 'whichPrder', this.whichOrder)
    this.getLocalStorage();
    this.getProdCats(0);
    this.isDeleted[0] = true;
    this.applicationForm = this.fb.group(this.formGroupAssemble());
    console.log('this.applicationForm', this.applicationForm)
    this.onChange();
  }
  /* get form control method */
  get applyReason() { return this.applicationForm.get('applyReason') }
  get productIdQty() { return this.applicationForm.get('productIdQty') as FormArray }
  get appliedQty() { return this.productIdQty.get('appliedQty') }
  
 
  /* form group obj */
  formGroupAssemble() {
    this.readonlyFlag = true;
    this.loadingFlag = false;
    let groupObj: any;
    if(this.command != 1) {
      groupObj = {
        staff: [{ value: this.staffName, disabled: this.readonlyFlag }],
        org: [{ value: this.orgName, disabled: this.readonlyFlag }],
        applyReason: [null, Validators.required],
        productIdQty: this.fb.array([this.createProd()])
      }
      // this.setUpdateModal(this.command, this.whichOrder, groupObj)
      // console.log('111', this.setUpdateModal(this.command, this.whichOrder, groupObj))
    } else if (this.command == 1) {
      this.hiddenFlag = true;
      // this.readonlyFlag = true;
      groupObj = {
        staff: [{ value: this.staffName, disabled: this.readonlyFlag }],
        org: [{ value: this.orgName, disabled: this.readonlyFlag }],
        applyReason: [{ value: this.whichOrder.ApplyReason, disabled: this.readonlyFlag }],
        productIdQty: this.fb.array(this.setFormArray(this.whichOrder, this.readonlyFlag)),
      }
      // this.setDetailModal(this.command, this.whichOrder, groupObj)
      // console.log('222', this.setDetailModal(this.command, this.whichOrder, groupObj))
    }
    return groupObj;
  }
  /* set update modal */
  setUpdateModal(command, whichOrder, groupObj) {
    console.log('setUpdateModal', command, whichOrder)
    // let formGroupObj;
    groupObj = {
      staffId: [''],
      orgId: [''],
      applyReason: ['', Validators.required],
      productIdQty: this.fb.array([this.createProd()])
    }
    return groupObj;
  }
  /* set detail modal */
  setDetailModal(command, whichOrder, groupObj) {
    console.log('setDetailModal', command, whichOrder)
    // let formGroupObj;
    this.hiddenFlag = true;
    this.readonlyFlag = true;
    groupObj = {
      staffId: [{ value: this.staffName, disabled: this.readonlyFlag }],
      orgId: [{ value: this.orgName, disabled: this.readonlyFlag }],
      applyReason: [{ value: this.whichOrder.ApplyReason, disabled: this.readonlyFlag }],
      productIdQty: this.fb.array(this.setFormArray(whichOrder, this.readonlyFlag)),
    }
    return groupObj;
  }
  createProd(): FormGroup {
    let prodObj = {
      prodCat: ['', Validators.required],
      prodType: ['', Validators.required],
      prod: ['', Validators.required],
      appliedQty: ['0', [Validators.required, Validators.pattern('[1-9]*')]]
    } 
    return this.fb.group(prodObj);
  }
  setFormArray(whichOrder, readonlyFlag) {
    let prodFormGroup;
    let prodFormArr = [];
    whichOrder.ApplicationDetails.map((prod, i) => {
      prodFormGroup = {
        prodCat: [{ value: prod.ProdCat.ProdCatName, disabled: readonlyFlag }],
        prodType: [{ value: prod.ProdType.ProdTypeName, disabled: readonlyFlag }],
        prod: [{ value: prod.Product.ProductName, disabled: readonlyFlag }],
        appliedQty: [{ value: prod.AppliedQty, disabled: readonlyFlag }]
      }
      prodFormArr.push(this.fb.group(prodFormGroup))
    })
    return prodFormArr;
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
    console.log('add productIdQty',this.productIdQty )
    // this.checkProductIdQty()
    if (prodLength > 1 || prodLength == 1) {
      for (let i in this.productIdQty.value) {
        console.log('i', i)
        this.isDeleted[i] = false;
      }
    }
    // console.log('add prodTypes', i, this.prodTypes, 'add prodNames', this.prodNames)
  }

  /* algorithm for add or minus prod number */
  minusQty(i: number) {
    let appliedQty = this.productIdQty.controls[i].get('appliedQty');
    let currentNumber = parseInt(appliedQty.value);
    let minusNumber = currentNumber - 1;
    appliedQty.setValue(minusNumber);
    this.applicationForm.updateValueAndValidity()
    //  console.log('minusNumber', minusNumber)  
  }
  increaseQty(i: number) {
    let appliedQty = this.productIdQty.controls[i].get('appliedQty');
    let currentNumber = parseInt(appliedQty.value); 
    let increaseNumber = currentNumber + 1;
    appliedQty.setValue(increaseNumber);
     console.log('increaseNumber', increaseNumber)
  }
  calculateQty() {
    // let currentValue = Number(this.productIdQty.controls[i].get('appliedQty').value);
    
  }
  /* add and update new data to table */
  onChange(): void {
    
    this.applicationForm.valueChanges.subscribe(
      () => {
        this.sendApplicationForm.emit(this.applicationForm)
      });
  }
  /* value for detail modal */

}