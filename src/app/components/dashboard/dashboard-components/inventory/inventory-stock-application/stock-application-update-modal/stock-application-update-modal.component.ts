import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockApplicationService } from 'src/app/shared/components/stock-application/stock-application.service';
import { Observable } from 'rxjs';
import { PostProduct } from 'src/app/models/PostProduct';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { FormGroup, FormArray } from '@angular/forms';
import { ProductIdQty } from 'src/app/models/ProductIdQty';
 

@Component({
  selector: 'app-stock-application-update-modal',
  templateUrl: './stock-application-update-modal.component.html',
  styleUrls: ['./stock-application-update-modal.component.css']
})
export class StockApplicationUpdateModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: number;
  @Output() passProduct = new EventEmitter<any>();
 public orgId: number;
  public orgName: string;
  public staffId: number;
  public staffName: string;
  public applicationForm: FormGroup;
  public message: string;
  public product$: Observable<PostProduct>;
  public formValid: boolean = false;
  public errors: any[] = [];
  public getPostProduct;
  public errorMessage;
  constructor(private stockApplicationService: StockApplicationService,
    private activeModal: NgbActiveModal,
    private inventoriesService: InventoriesService) { }

  ngOnInit() {
    console.log('applicationForm', this.applicationForm)
    this.stockApplicationService.currentForm.subscribe(message => this.message = message)
    console.log('update  stockApplicationService', this.message)
    console.log('update component command', this.command);
     // here we are getting our data from a service.
     this.stockApplicationService.currentForm.subscribe(
      data => { 
        this.product$ = data;
      },
      error => this.errors.push(error)
    );
  }
  
  isFormValid() {
    // console.log('isFormValid', this.formValid)
    if ( this.applicationForm == null || this.applicationForm.invalid ) {
      return true;
    } else {
      return false;
    }
  }
  errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can not catch Data!';
    }
  }
  
  handleSubmit() {
    console.log('applicationForm', this.applicationForm)
    let orgId = parseInt(localStorage.getItem('staffId')[0]);
    let staffId = parseInt(localStorage.getItem('staffId'));
    let applyReason = this.applicationForm.get('applyReason').value;
    let productDetail: Array<ProductIdQty> = [];
    const productIdQty = this.applicationForm.get('productIdQty');
    for (let prod of productIdQty.value) {
      let productId = Number(prod.prod);
      let appliedQty = prod.appliedQty;
      let productIdQty = new ProductIdQty(productId, appliedQty);
      productDetail.push(productIdQty);
    }
    let postProduct = new PostProduct(orgId, staffId, applyReason, productDetail);
    console.log('dataToPost', postProduct)
    // return postProduct;
    // here we are posting data from the forms to our form.
    // this.stockApplicationService.postUser( this.user, this.userProfile );
    this.inventoriesService.postProduct(postProduct).subscribe(
      res => {
        this.getPostProduct = res['Data'];
        this.passProduct.emit(res['Data'].ApplicationId)
        console.log('postdata', this.getPostProduct)
      },
      err => this.errHandler(err)
    )
  }
 
}
