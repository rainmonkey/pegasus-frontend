import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup, FormArray } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service';

@Component({
  selector: 'app-stock-application-form',
  templateUrl: './stock-application-form.component.html',
  styleUrls: ['./stock-application-form.component.css']
})
export class StockApplicationFormComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendApplicationForm = new EventEmitter<any>();
  
  /* loading */
  public loadingFlag: boolean = false;
  /* props for detail modal */
  public detailFlag: boolean = false;
  public readonlyFlag: boolean = false;
  /* props for form group */
  public applicationForm: FormGroup;
  public orgId: number;
  public orgName: string;
  public staffId: number;
  public staffName: string;
  public prodCats: any[] = [];
  public prodTypes: any[] = [];
  public prodNames: any[] = [];
  public deleteProd: boolean[] = [];
  public prodTypeValue: string[] = [];
  public prodNameValue: string[] = [];
  public default: string[] = [];
  /* props for server side */
  public errorMessage: string = '';
  /* props for update model */
  public editFlag: boolean = false;
  
  /* get form control  */
  get applyReason() { return this.applicationForm.get('applyReason') }
  get productIdQty() { return this.applicationForm.get('productIdQty') as FormArray }
  get productIdQtyLength() { return this.productIdQty.length }

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private inventoriesService: InventoriesService) { }

  ngOnInit() {
    // console.log('nogodel', this.prodTypeValue, this.prodNameValue)
    this.loadingFlag = true;
    this.deleteProd[0] = true;
    this.getLocalStorage();
    this.getProdCats(0);
    let formGroupAssemble = this.setFromGroup(this.command, this.whichOrder)
    this.applicationForm = this.fb.group(formGroupAssemble);
    this.formValueChanges();
  }
   /* get data from local storage */
   getLocalStorage() {
    let orgIdArr = localStorage.getItem('OrgId');
    this.orgId = parseInt(orgIdArr[1]);
    this.orgName = localStorage.getItem('organisations');
    this.staffId = parseInt(localStorage.getItem('staffId'));
    this.staffName = localStorage.getItem('userFirstName');
  }
  /* 
    define applicationForm according to condition 
      1) command === 1 means open detail modal can be read only
      2) command === 2 means open update modal
        => whichOrder === null, can add new stock application
        => whichOrder !== null, can edit current stock application
  */
  setFromGroup(command: number, whichOrder: any) {
    this.loadingFlag = false;
    this.readonlyFlag = true;
    let formGroupObj: any;
    if(command !== 1) {
      return this.setUpdateModal(whichOrder, formGroupObj)
    } else if (command === 1) {
      return this.setDetailModal(whichOrder, formGroupObj)
    }
  }
  /* define applicationForm of update modal */
  setUpdateModal(whichOrder: any, formGroupObj: any) {
    formGroupObj = {
      staff: [{ value: this.staffName, disabled: this.readonlyFlag }],
      org: [{ value: this.orgName, disabled: this.readonlyFlag }],
      applyReason: [whichOrder? whichOrder.ApplyReason : '', Validators.required],
      productIdQty: whichOrder? this.fb.array(this.setFormArray(whichOrder)) : this.fb.array([this.createProd()])
    }
    return formGroupObj;
  }
  /*  define applicationForm of detail modal */
  setDetailModal(whichOrder: any, formGroupObj: any) {
    this.detailFlag = true;
    formGroupObj = {
      staff: [{ value: this.staffName, disabled: this.readonlyFlag }],
      org: [{ value: this.orgName, disabled: this.readonlyFlag }],
      applyReason: [{ value: this.whichOrder.ApplyReason, disabled: this.readonlyFlag }],
      productIdQty: this.fb.array(this.setFormArray(whichOrder))
    }
    return formGroupObj;
  }
  /*  
    define applicationForm of productIdQty: FormArray according to open which modal
       1) this.detialFlag === true => open detail modal
       2) this.detialFlag === false => open update modal
  */
  setFormArray(whichOrder: any) {
    let prodFormGroup: any;
    let prodFormArr = [];
    whichOrder.ApplicationDetails.map((prod, i) => {
      this.getProdCats(i);
      this.getProdTypeByCat(prod.ProdCat.ProdCatId, i);
      this.getProdByType(prod.ProdType.ProdTypeId, i);
      this.editFlag = true;
      prodFormGroup = {
        prodCat: [ this.detailFlag? {value: prod.ProdCat.ProdCatName, disabled: this.readonlyFlag} : prod.ProdCat.ProdCatId, Validators.required ],
        prodType: [ this.detailFlag? {value: prod.ProdType.ProdTypeName, disabled: this.readonlyFlag} : prod.ProdType.ProdTypeId, Validators.required ],
        prod: [ this.detailFlag? {value: prod.Product.ProductName, disabled: this.readonlyFlag} : prod.Product.ProductId, Validators.required],
        appliedQty: [ this.detailFlag? {value: prod.AppliedQty, disabled: this.readonlyFlag} : prod.AppliedQty,[Validators.required, Validators.pattern('^[1-9][0-9]*$')]]
      }
      prodFormArr.push(this.fb.group(prodFormGroup))
    })
    return prodFormArr;
  }
  /* define productIdQty: FormArray when whichOrder === null after open update modal */
  createProd(): FormGroup {
    let prodObj = {
      prodCat: ['', Validators.required],
      prodType: ['', Validators.required],
      prod: ['', Validators.required],
      appliedQty: ['0', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]]
    } 
    return this.fb.group(prodObj);
  }
  /* get product data from server */
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
    this.editFlag = false;
    this.inventoriesService.getProdTypeByCat(cateId).subscribe(
      res => {
        this.prodTypes[i] = res['Data'][0].ProdType;
        if(!this.editFlag) {
          this.productIdQty.controls[i].get('prodType').setValue('default');
          this.productIdQty.controls[i].get('prod').setValue('default');
        }
      },
      err => this.errHandler(err)
    )
   
  }
  getProdByType(typeId: number, i: number) {
    this.inventoriesService.getProdByType(typeId).subscribe(
      res => {
        this.prodNames[i] = res['Data'];
        if(!this.editFlag) this.productIdQty.controls[i].get('prod').setValue('default');
      },
      err => this.errHandler(err)
    )
  }
  /* handle error from server */
  errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) this.errorMessage = err.ErrorMessage
    else this.errorMessage = 'Error! Can Not Catch Data!'
  }
 
  /* user interaction: event triggered form HTML */
  deleteForm(i: number) {
    // reset prodTypes and prodNames at the same time
    this.prodTypes.splice(i, 1);
    this.prodNames.splice(i, 1);
    this.productIdQty.removeAt(i);
    this.checkProductIdQtyLength();
  }
  addProduct(): void {
    this.getProdCats(this.productIdQtyLength);
    this.productIdQty.push(this.createProd());
    this.checkProductIdQtyLength();
  }
  /* 
    1) productIdQtyLength > 1 =>    delete button is actived
    2) productIdQtyLength === 1 =>  delete button is disabled
  */
  checkProductIdQtyLength = () => {
    this.productIdQty.value.map(
      (_, i) => this.productIdQtyLength > 1 ? this.deleteProd[i] = false : this.deleteProd[i] = true
    )
  }
  /* algorithm for add or minus prod quantity */
  minusQty(i: number) {
    this.calculateQty(i, 'minus')
  }
  increaseQty(i: number) {
    this.calculateQty(i, 'increase')
  }
  calculateQty(i: number, algorithm: string) {
    let appliedQty = this.productIdQty.controls[i].get('appliedQty');
    let currentNumber = parseInt(appliedQty.value); 
    algorithm === "increase"? appliedQty.patchValue( `${currentNumber + 1}`) : appliedQty.patchValue( `${currentNumber - 1}`);
  }
  /* send current application form to modal ( submit button ) for validation */
  formValueChanges(): void {
    this.applicationForm.valueChanges.subscribe(
      () => {
        this.sendApplicationForm.emit(this.applicationForm)
      });
  }
  
}