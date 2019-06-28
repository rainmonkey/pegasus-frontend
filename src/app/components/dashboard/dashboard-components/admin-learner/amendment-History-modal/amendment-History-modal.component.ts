import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-amendment-History-modal',
  templateUrl: './amendment-History-modal.component.html',
  styleUrls: ['./amendment-History-modal.component.css']
})
export class AmendmentHistoryModalComponent implements OnInit {
@Input() whichCourse;
  leave=[]
  amend=[]
  constructor(
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit() {
    console.log(this.whichCourse)
    this.courseAmend()
    this.leave1()
  }

  courseAmend(){
    for(let i of this.whichCourse.Amendment){
      if(i.AmendType == 2){
        this.amend.push(i)

      }
      console.log(this.amend)
    }
  }

  leave1(){
    for (let i of this.whichCourse.Amendment){
      if(i.AmendType == 1){
        this.leave.push(i)
      }
    }
  }
}
