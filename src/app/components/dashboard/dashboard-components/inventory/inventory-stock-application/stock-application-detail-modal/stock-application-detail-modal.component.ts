import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock-application-detail-modal',
  templateUrl: './stock-application-detail-modal.component.html',
  styleUrls: ['./stock-application-detail-modal.component.css']
})
export class StockApplicationDetailModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
