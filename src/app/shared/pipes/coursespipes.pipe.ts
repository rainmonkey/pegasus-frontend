import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coursespipes'
})
export class CoursespipesPipe implements PipeTransform {

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
      case 'Junior':
        return 1;
      case 'Intermediate':
        return 2;
      case 'Senior':
        return 3;
    }
  }
  

}
