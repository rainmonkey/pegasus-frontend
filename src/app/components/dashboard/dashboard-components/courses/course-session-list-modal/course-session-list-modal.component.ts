import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { CancelledLessonListComponent } from '../course-class-list/cancelled-lesson-list/cancelled-lesson-list.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-session-list-modal',
  templateUrl: './course-session-list-modal.component.html',
  styleUrls: ['./course-session-list-modal.component.css']
})
export class CourseSessionListModalComponent implements OnInit {
  //delete flag
  public isDeleteSuccess = false;
  public isDeleteFail = false;
  public errorMessage: string;

  @Input() command;
  @Input() whichCourseClass;

  constructor(
    public activeModal: NgbActiveModal,
    public coursesService: CoursesService
  ) { }

  ngOnInit() {
    console.log(this.whichCourseClass);
  }
  // Delete click event
}
