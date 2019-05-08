import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(
    public titleService: Title,

  ) {
    this.titleService.setTitle('Dashboard | Home');
  }

  ngOnInit() {
  }

}
