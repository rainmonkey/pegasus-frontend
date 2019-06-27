import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messager-icon',
  templateUrl: './messager-icon.component.html',
  styleUrls: ['./messager-icon.component.css']
})
export class MessagerIconComponent implements OnInit {
  public popUpModalFlag = true;
  constructor() { }

  ngOnInit() {
    console.log('????????????????')
  }

  popUpMessager(){
    this.popUpModalFlag = true;
  }

  closeMessager(event){
    if(event == 'true'){
      this.popUpModalFlag = false;
    }
  }

}
