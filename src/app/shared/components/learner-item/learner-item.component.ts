import { Component, OnInit, Input, } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminLearnerProfileComponent } from '../../../components/dashboard/dashboard-components/admin-learner/admin-learner-profile/admin-learner-profile.component';

@Component({
  selector: 'app-learner-item',
  templateUrl: './learner-item.component.html',
  styleUrls: ['./learner-item.component.css']
})
export class LearnerItemComponent implements OnInit {

  @Input() learner;
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }
  onClicked(){
    console.log(this.learner);
    this.showModal() ;
  }
  showModal() {
    const modalRef = this.modalService.open(AdminLearnerProfileComponent,{size:'lg'});
    let that = this;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
      (err) => {
        return
      }
    )
    //modalRef.componentInstance.whichLearner = whichLearner;
  }

}
