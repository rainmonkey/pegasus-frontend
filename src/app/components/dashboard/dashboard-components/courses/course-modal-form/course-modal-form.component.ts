import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-modal-form',
  templateUrl: './course-modal-form.component.html',
  styleUrls: ['./course-modal-form.component.css']
})
export class CourseModalFormComponent implements OnInit {
  public updateForm;

  @Input() command;
  @Input() whichCourse;

  constructor(private fb: FormBuilder) { }

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
}
