import { Component, OnInit, Input, ViewChild, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { StockApplicationProcessStatusComponent } from '../stock-application-process-status/stock-application-process-status.component';

@Component({
  selector: 'app-stock-application-reply-modal',
  templateUrl: './stock-application-reply-modal.component.html',
  styleUrls: ['./stock-application-reply-modal.component.css']
})
export class StockApplicationReplyModalComponent implements OnInit, AfterViewChecked {
  @Input() command: number;
  @Input() whichOrder: any;
  @Output() sendReplyRes: EventEmitter<any> = new EventEmitter;
  @ViewChild(StockApplicationProcessStatusComponent) stockApplicationProcessStatusComponent;

  public replyFlag: boolean = false;
  public replyMsg: string;
  public isApproved: boolean = false;

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.replyFlag = true;
  }
  ngAfterViewChecked() {
    this.replyMsg = this.stockApplicationProcessStatusComponent.replyMsg;
    this.isApproved = this.stockApplicationProcessStatusComponent.isApproved;
  }
  sendReplyMsg() {
    let applicationId = this.whichOrder.ApplicationId;
    let applyAt = this.whichOrder.ApplyAt;
    let isApproved = this.isApproved;
    this.inventoriesService.replyContent(applicationId, this.replyMsg, applyAt, isApproved).subscribe(
      res => {
        // console.log('reply', res['Data'])
        this.sendReplyRes.emit(res['Data'])
      },
      err => console.log('err', err)
    )
  }

}
