import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  hoverMessageIcon(event){
    console.log(event.target.firstChild)
    console.log('a')
  }
}
