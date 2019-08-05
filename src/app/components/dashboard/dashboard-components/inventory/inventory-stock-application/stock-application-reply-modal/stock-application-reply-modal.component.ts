import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { StockApplicationProcessStatusComponent } from '../stock-application-process-status/stock-application-process-status.component';

@Component({
  selector: 'app-stock-application-reply-modal',
  templateUrl: './stock-application-reply-modal.component.html',
  styleUrls: ['./stock-application-reply-modal.component.css']
})
export class StockApplicationReplyModalComponent implements OnInit, AfterViewChecked {
  @Input() command: number;
  @Input() whichOrder: any;
  @ViewChild(StockApplicationProcessStatusComponent) stockApplicationProcessStatusComponent;

  public replyFlag: boolean = false;
  public replyMsg: string;

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.replyFlag = true;
  }
  ngAfterViewChecked() {
    this.replyMsg = this.stockApplicationProcessStatusComponent.replyMsg
  }
  sendReplyMsg() {
    let applicationId = this.whichOrder.ApplicationId;
    let applyAt = this.whichOrder.ApplyAt;
    this.inventoriesService.replyContent(applicationId, this.replyMsg, applyAt).subscribe(
      res => {
        console.log('reply', res['Data'])
        Swal.fire({
          title: 'Successfully sent!',
          type: 'success',
          showConfirmButton: true,
        });
        this.activeModal.close();
      },
      err => console.log('err', err)
    )
  }
  
}
