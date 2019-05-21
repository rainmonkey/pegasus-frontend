import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';

@Component({
  selector: 'app-course-detail-modal',
  templateUrl: './course-detail-modal.component.html',
  styleUrls: ['./course-detail-modal.component.css']
})
export class CourseDetailModalComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;


  @Input() command;
  @Input() whichCourse;
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;

  constructor(
    public activeModal: NgbActiveModal,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    let vailadValue = this.checkInputVailad();
    if (vailadValue != null) {
      this.stringifySubmitStr(vailadValue)
    }
  }

  checkInputVailad() {
    let valueToSubmit = this.modalUpdateFormComponentObj.updateForm.value;
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.modalUpdateFormComponentObj.updateForm.controls) {
      this.modalUpdateFormComponentObj.updateForm.controls[i].touched = true;
    }
    //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
    if (this.modalUpdateFormComponentObj.updateForm.status == 'VALID') {
      return this.prepareSubmitData(valueToSubmit);
    }
    else {
      this.errorMessage = 'Please check your input.'
      return null;
    } 
  }

  prepareSubmitData(valueToSubmit) {
    valueToSubmit.CourseType = this.checkCourseType(valueToSubmit);
    valueToSubmit.Level = this.checkLevel(valueToSubmit);
    valueToSubmit.CourseCategoryId = this.checkCourseCategoryId(valueToSubmit);
    valueToSubmit.Duration = this.checkDuration(valueToSubmit);
    valueToSubmit.TeacherLevel = this.checkTeacherLevel(valueToSubmit);
    return valueToSubmit;
  }

  /*
    after stringify submition string, data is ready to submit
  */
  stringifySubmitStr(vailadValue) {
    this.errorMessage = '';
    this.submitByMode()
  }

  submitByMode() {
    //while push a stream of new data
    if (this.command == 0) {
      this.coursesService.addNew(this.modalUpdateFormComponentObj.updateForm.value).subscribe(
        (res) => {
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          if (err.error.ErrorMessage != null) {
            this.errorMessage = err.error.ErrorMessage;
          }
          else {
            this.errorMessage = 'Error! Please check your input.'
          }
          console.log('Error', err);
        }
      );
    }
    //while update data
    else if (this.command == 2) {
      this.coursesService.update(this.modalUpdateFormComponentObj.updateForm.value, this.whichCourse.CourseId).subscribe(
        (res) => {
          alert('Submit success!');
          this.activeModal.close();          
        },
        (err) => {
          console.log(err);
          
        }
      )
    }
  }

  checkCourseType(valueToSubmit) {
    switch (valueToSubmit.CourseType) {
      case 'One to One':
        return 1;
      case 'Group':
        return 2;
    }
  }

  checkDuration(valueToSubmit) {
    switch (valueToSubmit.Duration) {
      case "30 minutes":
        return 1;
      case "45 minutes":
        return 2;
      case "1 Hour":
        return 3;
      case "75 minutes":
        return 4;
    }
  }

  checkLevel(valueToSubmit) {
    switch (valueToSubmit.Level) {
      case "L0":
        return 0;
      case "L1":
        return 1;
      case "L2":
        return 2;
      case "L3":
        return 3;
      case "L4":
        return 4;
      case "L5":
        return 5;
      case "L6":
        return 6;
      case "L7":
        return 7;
      case "L8":
        return 8;
      case "L9":
        return 9;
      case "L10":
        return 10;
      case "L11":
        return 11;
      case "L12":
        return 12;
    }
  }

  checkCourseCategoryId(valueToSubmit) {
    switch (valueToSubmit.CourseCategoryId) {
      case 'piano':
        return 1;
      case 'drum':
        return 2;
      case 'guita':
        return 3;
      case 'violin':
        return 4;
      case 'cello':
        return 5;
      case 'vioce':
        return 6;
      case 'theory':
        return 7;
      case 'aural':
        return 8;
      case 'other-specify':
        return 9;
    }
  }

  checkTeacherLevel(valueToSubmit) {
    switch (valueToSubmit.TeacherLevel) {
      case 'Junior':
        return 1;
      case 'Intermediate':
        return 2;
      case 'Senior':
        return 3;
    }
  }
}
