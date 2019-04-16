import { Component } from '@angular/core';
import { setFirstTemplatePass } from '@angular/core/src/render3/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pegasus Login';

  public logture = true;

  constructor() { }

}
