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
  @Input() whichOrder: any;
  @Output() passApplicationId = new EventEmitter<number>();

  /* get appicationForm value by valueChange and event emit method from StockApplicationFormComponent */
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
    // console.log('dataToPost', postProduct);
    return postProduct;
  }
  handleSubmit() {
    // console.log('submit form', this.applicationForm);
    this.inventoriesService.postProduct(this.getDataToPost()).subscribe(
      res => {
        // console.log('subscribe post res', res['Data']);
        this.passApplicationId.emit(res['Data'].ApplicationId)
      },
      err => this.errHandler(err)
    )
  }
  errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can not catch Data!';
    }
  }
  
}
