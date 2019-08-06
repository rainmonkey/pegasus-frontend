import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';

@Component({
  selector: 'app-stock-application-receive-modal',
  templateUrl: './stock-application-receive-modal.component.html',
  styleUrls: ['./stock-application-receive-modal.component.css']
})
export class StockApplicationReceiveModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private inventoriesService: InventoriesService) { }

  ngOnInit() {
  }

}
