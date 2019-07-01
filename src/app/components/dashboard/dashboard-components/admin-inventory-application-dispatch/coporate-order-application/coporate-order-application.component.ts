import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coporate-order-application',
  templateUrl: './coporate-order-application.component.html',
  styleUrls: ['./coporate-order-application.component.css']
})
export class CoporateOrderApplicationComponent implements OnInit {
  public loadingFlag: boolean = false;
  constructor() { }

  ngOnInit() {
    this.loadingFlag = true;
  }

}
