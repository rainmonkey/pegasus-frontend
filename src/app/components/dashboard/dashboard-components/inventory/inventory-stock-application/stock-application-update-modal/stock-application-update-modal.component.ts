import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() whichOrder: any;
  @Output() passApplicationId = new EventEmitter<number>();
  @Output() updateApplication = new EventEmitter<any>();

  /* get appicationForm by valueChanges and event emit method from StockApplicationFormComponent */
  public applicationForm: FormGroup;
  /* props will be assigned after subscribing an observable */
  public errorMessage: string;

  constructor(private activeModal: NgbActiveModal,
    private inventoriesService: InventoriesService) { }

  ngOnInit() {
  }
  
  checkFormValid() {
    if ( this.applicationForm == null || this.applicationForm.invalid ) {
      return true;
    } else {
      return false;
    }
  }
  getDataToPost() {
    const orgId = +localStorage.getItem('OrgId')[1];
    const orgName = localStorage.getItem('organisations');
    const staffId = parseInt(localStorage.getItem('staffId'));
    const staffName = localStorage.getItem('userFirstName');
    const applyReason = this.applicationForm.get('applyReason').value;
    const productDetail: Array<ProductIdQty> = [];
    const productIdQty = this.applicationForm.get('productIdQty');
    for (let prod of productIdQty.value) {
      let productId = Number(prod.prod);
      let appliedQty = prod.appliedQty;
      let productIdQty = new ProductIdQty(productId, appliedQty);
      productDetail.push(productIdQty);
    }
    let postProduct = new PostProduct(orgId, staffId, applyReason, productDetail);
    if(this.whichOrder) {
      postProduct['ApplyStaff'] = staffName;
      postProduct['Org'] = orgName;
      return postProduct
    } else return postProduct;
  }
  handleSubmit() {
    !this.whichOrder? this.postProduct() : this.putProduct(this.whichOrder.ApplicationId)
  }
  postProduct() {
    console.log('post', this.getDataToPost())
    this.inventoriesService.postProduct(this.getDataToPost()).subscribe(
      res => this.passApplicationId.emit(res['Data'].ApplicationId),
      err => this.errHandler(err)
    )
  }
  putProduct(applicationId) {
    console.log('put', this.getDataToPost())
    this.inventoriesService.putProduct(applicationId, this.getDataToPost()).subscribe(
      res => this.updateApplication.emit(res['Data']),
      err => this.errHandler(err)
    )
  }
  errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) this.errorMessage = err.error.ErrorMessage
    else this.errorMessage = 'Error! Can not catch Data!'
  }
  
}
