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
