import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-inventory-receipt-modal',
  templateUrl: './inventory-receipt-modal.component.html',
  styleUrls: ['./inventory-receipt-modal.component.css']
})
export class InventoryReceiptModalComponent implements OnInit {
  @Input() command;
  @Input() whichStockOrder;

  //loading
  public loadingFlag: boolean = false;
  public photoUrl: any = environment.photoUrl;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.loadingFlag = true;
    if (this.getPhotoSrc(this.whichStockOrder.ReceiptImg)) {
      this.loadingFlag = false;
    }
  }

  /*
   get photo src
 */
  getPhotoSrc(photoObj) {
    if (this.whichStockOrder[photoObj] == null) {
      return '../../../../../../assets/images/shared/default-employer-profile.png';
    }
    else {
      return this.photoUrl + this.whichStockOrder[photoObj];
    }
  }

  /*
    if photo not found, set default photo
  */
  setDefaultPhoto(event) {
    event.target.src = '../../../../../../assets/images/shared/default-employer-profile.png';
    return;
  }
}
