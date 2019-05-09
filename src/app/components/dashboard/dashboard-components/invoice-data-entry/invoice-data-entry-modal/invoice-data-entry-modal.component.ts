import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-data-entry-modal',
  templateUrl: './invoice-data-entry-modal.component.html',
  styleUrls: ['./invoice-data-entry-modal.component.css']
})
export class InvoiceDataEntryModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  sendMail(){
    confirm("Click OK for sending this invoice to customer")
  }
}
