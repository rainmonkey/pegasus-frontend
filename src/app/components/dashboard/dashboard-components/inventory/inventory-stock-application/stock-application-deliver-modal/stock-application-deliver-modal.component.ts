import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';

@Component({
  selector: 'app-stock-application-deliver-modal',
  templateUrl: './stock-application-deliver-modal.component.html',
  styleUrls: ['./stock-application-deliver-modal.component.css']
})
export class StockApplicationDeliverModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendDeliverRes = new EventEmitter<any>();

  public errorMessage: string;

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
  }


  dataToDeliver() {
    let deliverObj = {};
    let tempObj = {};
    this.whichOrder.ApplicationDetails.map((order, i) => {
      let productId = order.Product.ProductId
      let quantity = order.AppliedQty;
      tempObj[productId] = quantity
    });
    deliverObj['ApplicationId'] = this.whichOrder.ApplicationId;
    deliverObj['ApplicationDetailsIdMapQty'] = tempObj;
    return deliverObj
  }
  deliver() {
    this.inventoriesService.deliverProduct(this.dataToDeliver()).subscribe(
      res => {
        // console.log('res', res['Data'])
        this.sendDeliverRes.emit(res['Data'])
      },
      err => this.errHandler(err)
    )
  }
   /* handle error from server */
   errHandler(err: any) {
    console.warn(err);
    if (err.ErrorMessage != null) this.errorMessage = err.ErrorMessage
    else this.errorMessage = 'Deliver failed!'
  }
}
