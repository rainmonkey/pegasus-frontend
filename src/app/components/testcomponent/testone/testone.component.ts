import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingModalComponent } from '../../dashboard/dashboard-components/support/rating-modal/rating-modal.component';


@Component({
  selector: 'app-testone',
  templateUrl: './testone.component.html',
  styleUrls: ['./testone.component.css'],
  animations: [
    
  ]
})
export class TestoneComponent implements OnInit {

  constructor(private modalService: NgbModal,) { }

  ngOnInit() {

  }
  popUpModal(){
    const modalRef = this.modalService.open(RatingModalComponent,{ size: 'lg' });
  }


}
