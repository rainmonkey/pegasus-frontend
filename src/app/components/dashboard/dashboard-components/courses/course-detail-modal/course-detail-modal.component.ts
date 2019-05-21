import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CoursespipesPipe } from '../../../../../shared/pipes/coursespipes.pipe'

@Component({
  selector: 'app-course-detail-modal',
  templateUrl: './course-detail-modal.component.html',
  styleUrls: ['./course-detail-modal.component.css']
})
export class CourseDetailModalComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;
  public infoMessage: string = '';
  public messageColor:string;
  public updateForm: FormGroup;

  @Input() command;
  @Input() whichCourse;

  constructor(
    public coursesPipe: CoursespipesPipe,
    public activeModal: NgbActiveModal,
    private coursesService: CoursesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group(this.formGroupAssemble());
  }

  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        CourseName: [null, Validators.required],
        CourseType: [null, Validators.required],
        Level: [null, Validators.required],
        TeacherLevel: [null, Validators.required],
        Duration: [null, Validators.required],
        Price: [null, Validators.required],
        CourseCategoryId: [null, Validators.required]
      }
    }
    else {
      groupObj = {
        //formControlName 决定了提交表单时的参数名
        CourseName: [this.whichCourse.CourseName, Validators.required],
        CourseType: [this.whichCourse.CourseTypeName, Validators.required],
        Level: [this.whichCourse.LevelName, Validators.required],
        TeacherLevel: [this.whichCourse.TeacherLevelName, Validators.required],
        Duration: [this.whichCourse.DurationName, Validators.required],
        Price: [this.whichCourse.Price, Validators.required],
        CourseCategoryId: [this.whichCourse.CourseCategory.CourseCategoryName, Validators.required],
        CourseId: [this.whichCourse.CourseId, Validators.required]
      }
    }
    return groupObj;
  }

  onSubmit() {
    let valueToSubmit = this.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    // fix this
    if (vailadValue !== null) {
      // console.log('Correct')
      this.stringifySubmitStr(vailadValue);
      // console.log(this.updateForm.value);
    } else {
      // console.log('errors')
      this.errorMessage = 'Input incorrect.'
    }
  }

   /*
    check whether data vailad or not(ruled by Validators).
  */
 checkInputVailad(valueToSubmit) {
  //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
  // for (let i in this.updateForm.controls) {
  //   this.updateForm.controls[i].touched = true;
  // }
  //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
  if (this.updateForm.status == 'VALID') {
    return this.prepareSubmitData(valueToSubmit);
  }
  else {
    this.infoMessage = 'Please check your input.'
    this.messageColor = '#dc3545'
    return null;
  }
}

  prepareSubmitData(valueToSubmit) {
    valueToSubmit.CourseType = this.coursesPipe.checkCourseType(valueToSubmit);
    valueToSubmit.Level = this.coursesPipe.checkLevel(valueToSubmit);
    valueToSubmit.CourseCategoryId = this.coursesPipe.checkCourseCategoryId(valueToSubmit);
    valueToSubmit.Duration = this.coursesPipe.checkDuration(valueToSubmit);
    valueToSubmit.TeacherLevel = this.coursesPipe.checkTeacherLevel(valueToSubmit);
    return valueToSubmit;
  }

  /*
    after stringify submition string, data is ready to submit
  */
  stringifySubmitStr(formValue) {
    this.errorMessage = '';
    this.submitByMode(formValue)
  }

  submitByMode(formValue) {
    //while push a stream of new data
    if (this.command == 0) {
      this.coursesService.addNew(formValue).subscribe(
        (res) => {
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err)
        }
      );
    }
    //while update data
    else if (this.command == 2) {
      this.coursesService.update(formValue, this.whichCourse.CourseId).subscribe(
        (res) => {
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err)
        }
      )
    }
  }

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
