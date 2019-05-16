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
          this.successMessage = 'Submit success!';
          // this.activeModal.close();
        },
        (err) => {
          if (err.error.Message != null) {
            this.errorMessage = JSON.parse(err.error.Message);
            console.log(this.errorMessage);
          }
          else {
            this.errorMessage = 'Error! Please check your input.'
          }
        }
      );
    }
    //while update data
    else if (this.command == 1) {
      this.coursesService.update(this.whichCourse.value, this.whichCourse.CourseId).subscribe(
        (res) => {
          this.successMessage = 'Submit success!'
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  checkCourseType(valueToSubmit) {
    switch (valueToSubmit.CourseType) {
      case '1 to 1':
        return 1;
      case 'Group':
        return 2;
    }
  }

  checkLevel(valueToSubmit) {
    switch (valueToSubmit.Level) {
      case 'Junior':
        return 1;
      case 'Intermediate':
        return 2;
      case 'Senior':
        return 3;
    }
  }

  checkCourseCategoryId(valueToSubmit) {
    switch (valueToSubmit.CourseCategoryId) {
      case 'Piano':
        return 1;
      case 'Guita':
        return 2;
      case 'Drum':
        return 3;
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
