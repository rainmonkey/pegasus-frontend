import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock-application-reply-modal',
  templateUrl: './stock-application-reply-modal.component.html',
  styleUrls: ['./stock-application-reply-modal.component.css']
})
export class StockApplicationReplyModalComponent implements OnInit {
  @Input() command: number;
  @Input() whichOrder: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
