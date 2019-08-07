import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { StockApplicationProcessStatusComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-process-status/stock-application-process-status.component';

@Component({
  selector: 'app-stock-application-deliver-modal',
  templateUrl: './stock-application-deliver-modal.component.html',
  styleUrls: ['./stock-application-deliver-modal.component.css']
})
export class StockApplicationDeliverModalComponent implements OnInit, AfterViewChecked {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendDeliverRes = new EventEmitter<any>();
  @ViewChild(StockApplicationProcessStatusComponent) stockApplicationProcessStatusComponent

  public errorMessage: string;
  public deliverFlag: boolean = false;
  public deliveredQty: number[];

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.deliverFlag = true;
  }
  ngAfterViewChecked() {
    this.deliveredQty = this.stockApplicationProcessStatusComponent.deliveredQty;
  }

  dataToDeliver() {
    let deliverObj = {};
    let tempObj = {};
    this.whichOrder.ApplicationDetails.map((order, i) => {
      let DetaillsId = order.DetaillsId;
      let quantity = this.deliveredQty[i];
      tempObj[DetaillsId] = quantity
    });
    deliverObj['ApplicationId'] = this.whichOrder.ApplicationId;
    deliverObj['ApplicationDetailsIdMapQty'] = tempObj;
    return deliverObj
  }
  deliver() {
    this.inventoriesService.deliverProduct(this.dataToDeliver()).subscribe(
      res => {
        console.log('res', res['Data'])
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
