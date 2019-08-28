import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearnersService } from 'src/app/services/http/learners.service';


@Component({
  selector: 'app-model-template',
  templateUrl: './model-template.component.html',
  styleUrls: ['./model-template.component.css']
})
export class ModelTemplateComponent implements OnInit {
@Input() whichObject;
@Input() whichModal;
modelTitle;

// for timetable
@Input() learnerCourseTimeTable;
titleArray;

constructor(public activeModal: NgbActiveModal,private learnersService:LearnersService) {}
  getModalDetail(){
    switch (this.whichModal) {
      case 'pay Invoice':
        this.modelTitle = 'Invoice Payment';
        break;
      case 'Learner Credit':
        this.modelTitle = 'Learner Credit';
        break;
      case 'Learner Timetable':
        this.modelTitle = 'Learner\'s Timetable';
        break;
      default:
      this.modelTitle = '';
    }
  }
  ShowTimeTableDetail(){
    this.titleArray = this.learnerCourseTimeTable.event.title.split(' ');
    this.modelTitle = 'Learner\'s Course Detail';
  }

  ngOnInit() {
    console.log(this.learnerCourseTimeTable)
    if (this.whichModal) {
    this.getModalDetail();
    }
    if (this.learnerCourseTimeTable){
      this.ShowTimeTableDetail();
    }
  }
  onClicked(isAfter){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      console.log(this.learnerCourseTimeTable);
      console.log(this.learnerCourseTimeTable.event.extendedProps.lessonId);
      let { lessonId } =this.learnerCourseTimeTable.event.extendedProps;
      this.learnersService.makeUpSplitLesson(lessonId,isAfter).subscribe(
        (event) => {
          console.log(event);
          //@ts-ignore
          //this.eventsModel = this.putInfo(event.Data);
          Swal.fire({
            title: 'Your Operation Has Been Done!',
            type: 'success',
            showConfirmButton: true,
          });
          this.activeModal.close('Close click')
        },
        (err) => {
          let errMsg = err.error.ErrorMessage?err.error.ErrorMessage:"Something error!"
          Swal.fire('error!', errMsg,'error')
          }
      )
      })
  }
}
