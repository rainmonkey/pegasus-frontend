import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-course-modal',
  templateUrl: './teacher-course-modal.component.html',
  styleUrls: ['./teacher-course-modal.component.css']
})
export class TeacherCourseModalComponent implements OnInit {
  public CourseForm; 

  @Input() command;
  @Input() whichTeacher;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
