import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reason-Input',
  templateUrl: './reason-Input.component.html',
  styleUrls: ['./reason-Input.component.css']
})
export class ReasonInputComponent implements OnInit {
  CancelReason
  test1
  @ViewChild('selector') selector
  constructor() { }

  ngOnInit() {

  }

  test() {
    // if (this.CancelReason == 'Other') {
    //   let x = document.getElementById("mySelect").remove()
    //   this.test1 = document.createElement('input')
    //   this.test1.type='text'
    //   document.getElementById("reason").append(this.test1)
    //   console.log(x)
    //   console.log(this.test1)
  }

  changeInput() {
  
      //@ts-ignore
      if (document.querySelector('#myInput').style.display = 'none') {
        //@ts-ignore
        document.querySelector('#mySelect').style.display = 'none'
        //@ts-ignore
        document.querySelector('#myInput').removeAttribute('style')
        console.log(document.querySelector('#mySelect'))
        console.log(document.querySelector('#myInput'))
        //@ts-ignore      
      } else {
        //@ts-ignore
        document.querySelector('#myInput').style.display = 'none'
        //@ts-ignore
        document.querySelector('#mySelect').removeAttribute('style')
        console.log(document.querySelector('#mySelect'))
        console.log(document.querySelector('#myInput'))
      }
    }
    

  }


