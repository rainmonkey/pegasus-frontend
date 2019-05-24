import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-course-class-detail-modal',
  templateUrl: './course-class-detail-modal.component.html',
  styleUrls: ['./course-class-detail-modal.component.css']
})
export class CourseClassDetailModalComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;
  public infoMessage: string = '';
  public messageColor: string;
  public updateForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private coursesService: CoursesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

}
