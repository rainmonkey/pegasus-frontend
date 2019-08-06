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
   
  /* trigger reply content */
  public canReply: boolean = false;
  /* reply content */
  public replyMsg: string;
  /* deliver modal */
  public deliveredQty: any[] = [];
  public productId: number;
  public validatorMsg: string;

  constructor(private inventoriesService: InventoriesService) { }

  ngOnInit() {
    console.log('replyFlag', this.replyFlag)
    console.log('deliverFlag', this.deliverFlag)
  }
  /* reply modal */
  approve() {
    this.canReply = true;
  }
  deny() {
    this.canReply = true;
  }
  cancelReply() {
    this.canReply = false;
    this.replyMsg = '';
  }
  /* deliver modal */
 
}
