import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  environmentVariables = environment

  constructor() { }

  ngOnInit() {
  }

}
