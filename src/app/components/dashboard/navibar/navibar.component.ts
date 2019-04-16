import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navibar',
  templateUrl: './navibar.component.html',
  styleUrls: ['./navibar.component.css']
})
export class NavibarComponent implements OnInit {

  public navitem: any[] = [
    {
      pagename : 'Home'
    },
    {
      pagename : 'Tables'
    },
    {
      pagename : 'Charts'
    },
    {
      pagename : 'Forms'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
