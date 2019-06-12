import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-inventory-reciept-modal',
  templateUrl: './inventory-reciept-modal.component.html',
  styleUrls: ['./inventory-reciept-modal.component.css']
})
export class InventoryRecieptModalComponent implements OnInit {
  @Input() command;
  @Input() whichStockOrder;

  //loading
  public loadingFlag: boolean = false;
  public photoUrl: any = environment.photoUrl;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.loadingFlag = true;
    if (this.getPhotoSrc(this.whichStockOrder.RecieptImg)) {
      this.loadingFlag = false;
    }
  }

  /*
   get photo src
 */
  getPhotoSrc(photoObj) {
    let src = this.whichStockOrder[photoObj];
    if (src == null) {
      return '../../../../../../assets/images/shared/default-employer-profile.png';
    }
    else {
      return this.photoUrl + src;
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
