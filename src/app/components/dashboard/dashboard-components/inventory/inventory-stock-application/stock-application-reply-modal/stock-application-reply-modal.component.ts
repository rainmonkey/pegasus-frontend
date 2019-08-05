import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import * as moment from 'moment/moment.js'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-stock-application-reply-modal',
  templateUrl: './stock-application-reply-modal.component.html',
  styleUrls: ['./stock-application-reply-modal.component.css']
})
export class StockApplicationReplyModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Input() headOfficeFlag: boolean;
  
  public replyFlag: boolean = false;
  /* behavior subject */
  public replyMsg: string;
  public subscription: Subscription;

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.subscription = this.inventoriesService.replyMsg$
      .subscribe(msg => this.replyMsg = msg)
  }
  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
  sendReplyMsg() {
    let applicationId = this.whichOrder.ApplicationId;
    console.log('reply msg', this.replyMsg)
    let applyAt = moment().format().slice(0,19);
    this.inventoriesService.replyContent(applicationId, this.replyMsg, applyAt).subscribe(
      res => {
        console.log('reply', res)
      },
      err => {
        console.log('err', err)
      }
    )
  }
  
}
