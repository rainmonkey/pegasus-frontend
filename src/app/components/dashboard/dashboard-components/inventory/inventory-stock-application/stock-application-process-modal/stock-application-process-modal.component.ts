import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-application-process-modal',
  templateUrl: './stock-application-process-modal.component.html',
  styleUrls: ['./stock-application-process-modal.component.css']
})
export class StockApplicationProcessModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;
  @Input() headOfficeFlag: boolean;
  @Output() sendDispute: EventEmitter<any> = new EventEmitter;

  public processFlag: boolean = false
  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.processFlag = true;
  }
  handleDispute() {
    let applicaitonId = this.whichOrder.ApplicationId;
    this.inventoriesService.solveDispute(applicaitonId).subscribe(
      res => {
        console.log('res', res['Data'])
        this.sendDispute.emit(res['Data']);
      },
      err => console.log('err', err)
    )
  }
}
