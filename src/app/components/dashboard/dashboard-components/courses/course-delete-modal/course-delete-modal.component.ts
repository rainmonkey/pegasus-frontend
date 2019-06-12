import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';

@Component({
  selector: 'app-course-delete-modal',
  templateUrl: './course-delete-modal.component.html',
  styleUrls: ['./course-delete-modal.component.css']
})
export class CourseDeleteModalComponent implements OnInit {
  //delete flag
  public isDeleteSuccess = false;
  public isDeleteFail = false;
  public errorMessage: string;

  @Input() command;
  @Input() whichCourse;
  @Input() whichCourseClass;

  constructor(
    public activeModal: NgbActiveModal,
    public coursesService: CoursesService
  ) { }

  ngOnInit() {
  }
  // Delete click event
  delete() {
    if (this.command == 3) {
      let courseId = this.whichCourse.CourseId;
      this.coursesService.deleteCourse(courseId).subscribe(
        (res) => {
          this.isDeleteSuccess = true;
          //successful info
          alert('Delete success!');
          this.activeModal.close();
        },
        (err) => {
          //fail info
          this.isDeleteFail = true;
          this.backendErrorHandler(err);
        }
      )
    } else if (this.command == 4) {
      let groupcourseinstanceId = this.whichCourseClass.GroupCourseInstanceId;
      this.coursesService.deleteCourseClass(groupcourseinstanceId).subscribe(
        (res) => {
          this.isDeleteSuccess = true;
          //successful info
          alert('Delete success!');
          this.activeModal.close();
        },
        (err) => {
          //fail info
          this.isDeleteFail = true;
          this.backendErrorHandler(err);
        }
      );
    }
  }
  // Show error message
  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }

}
