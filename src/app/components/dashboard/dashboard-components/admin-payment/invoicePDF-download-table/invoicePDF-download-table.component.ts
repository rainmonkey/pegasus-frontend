import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-invoicePDF-download-table',
  templateUrl: './invoicePDF-download-table.component.html',
  styleUrls: ['./invoicePDF-download-table.component.css']
})
export class InvoicePDFDownloadTableComponent implements OnInit {
@Input() whichLearner
  constructor() { }

  ngOnInit() {
    console.log(this.whichLearner)
  }


}
