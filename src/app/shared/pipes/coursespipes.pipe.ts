import { Pipe, PipeTransform } from '@angular/core';
import { CourseDetailModalComponent } from '../../components/dashboard/dashboard-components/courses/course-detail-modal/course-detail-modal.component';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'coursespipes'
})
export class CoursespipesPipe implements PipeTransform {
  public coursedetailmodal: CourseDetailModalComponent;
  constructor(
    private datePipe: DatePipe
  ){}

  transform(valueToSubmit) {
    this.checkCourseType(valueToSubmit);
    this.checkCourseCategoryId(valueToSubmit);
    this.checkDuration(valueToSubmit);
    this.checkLevel(valueToSubmit);
    this.checkTeacherLevel(valueToSubmit);
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
      case "30 mins":
        return 1;
      case "45 mins":
        return 2;
      case "60 mins":
        return 3;
    }
  }

  checkLevel(valueToSubmit) {
    switch (valueToSubmit.Level) {
      case "G3&Under":
        return 0;
      case "G4&G5":
        return 1;
      case "G6&G7":
        return 2;
      case "G8":
        return 3;
      case "G9":
        return 4;
      case "G10":
        return 5;
      case "G11":
        return 6;
      case "G12":
        return 7;
    }
  }

  checkCourseCategoryId(valueToSubmit) {
    switch (valueToSubmit.CourseCategoryId) {
      case 'Piano':
        return 1;
      case 'Drum':
        return 2;
      case 'Guitar':
        return 3;
      case 'Violin':
        return 4;
      case 'Cello':
        return 5;
      case 'Vioce':
        return 6;
      case 'Theory':
        return 7;
      case 'Aural':
        return 8;
      case 'Other-specify':
        return 9;
    }
  }

  checkTeacherLevel(valueToSubmit) {
    switch (valueToSubmit.TeacherLevel) {
      case 'Internship':
        return 1;
      case 'Normal':
        return 2;
      case 'Senior':
        return 3;
      case 'Specialist':
        return 4;
      case 'Professor':
        return 5;
    }
  }


}
