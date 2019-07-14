import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pageGroup-list',
  templateUrl: './pageGroup-list.component.html',
  styleUrls: ['./pageGroup-list.component.css']
})
export class PageGroupListComponent implements OnInit {
  @Input() command;
  @Input() whichPageGroup;
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit() {
  }

}
