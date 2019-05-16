import { Component, OnInit, Input } from '@angular/core';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-delete-modal',
  templateUrl: './course-delete-modal.component.html',
  styleUrls: ['./course-delete-modal.component.css']
})
export class CourseDeleteModalComponent implements OnInit {
  //delete flag
  public isDeleteSuccess = false;
  public isDeleteFail = false;

  @Input() command;
  @Input() whichCourse;

  constructor(
    public activeModal: NgbActiveModal,
    public coursesService:CoursesService,
  ) { }

  ngOnInit() {
  }

  delete(){
    let courseId = this.whichCourse.CourseId;
    this.coursesService.deleteCourse(courseId).subscribe(
      (res) => {
        this.isDeleteSuccess = true;
        //successful info
      },
      (err) => {
        //fail info
        this.isDeleteFail = true;
        console.log('err',err)
      }
    );
  }

}
