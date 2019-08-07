import { Component, OnInit, Input, ViewChild, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { StockApplicationProcessStatusComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-process-status/stock-application-process-status.component';

@Component({
  selector: 'app-stock-application-receive-modal',
  templateUrl: './stock-application-receive-modal.component.html',
  styleUrls: ['./stock-application-receive-modal.component.css']
})
export class StockApplicationReceiveModalComponent implements OnInit, AfterViewChecked {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendReceiveRes: EventEmitter<any> = new EventEmitter;

  @ViewChild(StockApplicationProcessStatusComponent) stockApplicationProcessStatusComponent;
  
  public receiveFlag: boolean = false;
  public receivedQty: any[] = [];

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }
  
  ngOnInit() {
    this.receiveFlag = true;
    console.log('ReiceveModalcommand', this.command, 'whichOrder', this.whichOrder)
  }
  ngAfterViewChecked() {
    this.receivedQty = this.stockApplicationProcessStatusComponent.receivedQty;
  }
  dataToReceive() {
    let receiveObj = {};
    let tempObj = {};
    this.whichOrder.ApplicationDetails.map((order, i) => {
      let DetaillsId = order.DetaillsId;
      let quantity = this.receivedQty[i];
      tempObj[DetaillsId] = quantity
    });
    receiveObj['ApplicationId'] = this.whichOrder.ApplicationId;
    receiveObj['ApplicationDetailsIdMapQty'] = tempObj;

    return receiveObj
  }
  sendReceiveMsg() {
    this.inventoriesService.receiveProduct(this.dataToReceive()).subscribe(
      res => {
        console.log('res', res['Data'])
        this.sendReceiveRes.emit(res['Data'])
      },
      err => console.log('err', err)
    )
  }
  
}
