import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { LearnersService } from 'src/app/services/http/learners.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RefreshService } from 'src/app/services/others/refresh.service';

@Component({
  selector: 'app-learner-update-modal',
  templateUrl: './learner-update-modal.component.html',
  styleUrls: ['./learner-update-modal.component.css']
})
export class LearnerUpdateModalComponent implements OnInit {
  public errorMessage: string = '';
  public successMessage: string = '';

  @Input() command;
  @Input() whichLearner;
  //in order to get the form from child component(TeacherModalFormDComponent)
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;

  constructor(
    public activeModal: NgbActiveModal,  
    private LearnerListService: LearnersService, 
    private refreshService: RefreshService) { }


  ngOnInit() {
  }
  
  requestRefreshPage() {
    this.activeModal.close('Cross click');
    this.refreshService.sendRefreshRequest();
  }
  
}
