import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';

@Component({
  selector: 'app-learner-detail-modal',
  templateUrl: './learner-detail-modal.component.html',
  styleUrls: ['./learner-detail-modal.component.css']
})
export class LearnerDetailModalComponent implements OnInit {
  @Input() command;
  @Input() whichLearner;
  public isGroupCourse: boolean = true;
  public isCustomCourse: boolean = false;
  public learnerPurpose: Array<any>;
  public howKnown: Array<any>;
  constructor(public activeModal: NgbActiveModal,   private LearnerListService: LearnersService,) { }

  ngOnInit() {
    console.log(this.whichLearner)
  }
  chooseGroupCourse() {
    this.isGroupCourse = true;
    this.isCustomCourse = false;
  }
  chooseCustomCourse() {
    this.isCustomCourse = true;
    this.isGroupCourse = false;
  }

  getLookups(id: number) {
    // this.registrationService.getLookups(1)
    //   .subscribe(
    //     data => {
    //       console.log('teacher info', data);
    //       this.learnerPurpose = data.Data;
    //     },
    //     err => {
    //       console.log('teacher info err', err);
    //     }
    //   );
    this.LearnerListService.getLookups(2)
      .subscribe(
        data => {
          console.log('learner purpose', data);
          this.learnerPurpose = data.Data;
          for (let lP of this.learnerPurpose) {
            lP.isChecked = false;
          }
        },
        err => {
          console.log('learner purpose err', err);
        }
      );
    this.LearnerListService.getLookups(3)
      .subscribe(
        data => {
          console.log('how know', data);
          this.howKnown = data.Data;
          this.howKnown.map((o, i) =>
            o.isChecked = false)
        },
        err => {
          console.log('how know err', err);
        }
      );
  }

   /*
    if photo not found, set default photo 
  */
 setDefaultPhoto(event) {
  event.target.src = '../../../../../../assets/images/shared/default-employer-profile.png';
  return;
}
}
