import { Component, OnInit, Input } from '@angular/core';
import { InventoriesService } from 'src/app/services/http/inventories.service';

@Component({
  selector: 'app-stock-application-process-status',
  templateUrl: './stock-application-process-status.component.html',
  styleUrls: ['./stock-application-process-status.component.css']
})
export class StockApplicationProcessStatusComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Input() replyFlag: boolean;
  @Input() deliverFlag: boolean;
  @Input() receiveFlag: boolean;
  @Input() processFlag: boolean;

  /* trigger reply content */
  public canReply: boolean = false;
  /* reply content */
  public replyMsg: string;
  public isApproved: boolean = false;
  /* deliver modal */
  public deliveredQty: any[] = [];
  public receivedQty: any[] = [];
  public productId: number;
  public validatorMsg: string;
  /* if there is a dispute */
  public isDisputed: boolean[] = [];

  constructor(private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.checkQuantity();
  }
  /* check deliveredQty === deliveredQty ? */
  checkQuantity() {
    if(this.whichOrder.ProcessStatus === 5) {
      this.whichOrder.ApplicationDetails.map((prod, i) => {
        if(prod.DeliveredQty === prod.ReceivedQty) {
          this.isDisputed[i] = false;
        }
        else this.isDisputed[i] = true;
      })
    }
  }
  /* reply modal */
  approve() {
    this.canReply = true;
    this.isApproved = true;
  }
  deny() {
    this.canReply = true;
    this.isApproved = false;
  }
  cancelReply() {
    this.canReply = false;
    this.replyMsg = '';
  }

}
