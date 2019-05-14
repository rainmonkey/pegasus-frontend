import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from './../../../../../services/http/courses.service';

@Component({
  selector: 'app-course-detail-modal',
  templateUrl: './course-detail-modal.component.html',
  styleUrls: ['./course-detail-modal.component.css']
})
export class CourseDetailModalComponent implements OnInit {
  public errorMessage: string;
  @Input() command;
  @Input() whichCourse;
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;


  constructor(public activeModal: NgbActiveModal, private coursesService: CoursesService) { }

  ngOnInit() {
  }

  // onSubmit() {
  //   let vailadValue = this.checkInputVailad();
  //   if (vailadValue !== null) {
  //     this.stringifySubmitStr(vailadValue)
  //   }
  // }

  // checkInputVailad() {
  //   let valueToSubmit = this.modalUpdateFormComponentObj.updateForm.value;
  //   //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
  //   for (let i in this.modalUpdateFormComponentObj.updateForm.controls) {
  //     this.modalUpdateFormComponentObj.updateForm.controls[i].touched = true;
  //   }
  //   //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
  //   if (this.modalUpdateFormComponentObj.updateForm.status == 'VALID') {
  //     return this.prepareSubmitData(valueToSubmit);
  //   }
  //   else {
  //     this.errorMessage = 'Please check your input.'
  //     return null;
  //   }
  // }

  // prepareSubmitData(valueToSubmit) {
  //   valueToSubmit.Level = this.checkLevel(valueToSubmit);
  //   valueToSubmit.Type = this.checkType(valueToSubmit);
  //   valueToSubmit.CourseCategoryName = this.checkCourseCategoryName(valueToSubmit);
  //   valueToSubmit.TeacherLevel = this.checkTeacherLevel(valueToSubmit);
  //   return valueToSubmit;
  // }


}
