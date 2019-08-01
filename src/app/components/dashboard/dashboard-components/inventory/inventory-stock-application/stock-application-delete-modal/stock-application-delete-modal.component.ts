import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock-application-delete-modal',
  templateUrl: './stock-application-delete-modal.component.html',
  styleUrls: ['./stock-application-delete-modal.component.css']
})
export class StockApplicationDeleteModalComponent implements OnInit {
  /* form StockApplicationListComponent */
  @Input() whichOrder: any;
  /* to StockApplicationListComponent */
  @Output() sendDeleteResult = new EventEmitter<any>();

  public orderId: number;
  public isDeleted: boolean = false;
  public isShow: boolean = true;
  public errMsg: string;

  constructor(private inventoriesService: InventoriesService,
    private activeModal: NgbActiveModal) { }

  ngOnInit() {
    /* get param which will be passed to server in order to delete order */
    this.orderId = this.whichOrder.ApplicationId;
  }
  delete() {
    this.inventoriesService.deleteProduct(this.orderId).subscribe(
      res => {
        console.log('delete res', res);
        this.isShow = false;
        this.isDeleted = true;
      },
      err => {
        console.log('delete err', err)
        this.errMsg = err.error.ErrorMessage;
        this.isShow = false;
        this.isDeleted = false;
      }
    )
  }
  onClose() {
    return (
      this.activeModal.close(),
      this.sendDeleteResult.emit(this.orderId)
    )
  }
}
