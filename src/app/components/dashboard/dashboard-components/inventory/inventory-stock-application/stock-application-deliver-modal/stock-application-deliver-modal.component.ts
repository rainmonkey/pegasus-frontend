import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock-application-deliver-modal',
  templateUrl: './stock-application-deliver-modal.component.html',
  styleUrls: ['./stock-application-deliver-modal.component.css']
})
export class StockApplicationDeliverModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log('deliver modal', this.whichOrder)
  }
  deliver() {
    let deliverObj = {};
    let tempObj = {};
    deliverObj['ApplicationId'] = this.whichOrder.ApplicationId;
    deliverObj['ApplicationDetailsIdMapQty'] = 
    this.whichOrder.ApplicationDetails.map((order, i) => {
      let productId = order.Product.productId;
      let quantity = order.AppliedQty;
      tempObj = {
        productId: quantity
      }
      console.log('aaa', tempObj)
    })
  }
}
