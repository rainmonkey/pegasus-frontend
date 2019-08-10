import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teacherLevel'
})
export class TeacherLevelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(Number(value)){
      case 1:
        return 'Internship';
        break;
      case 2:
        return 'Normal';
        break;
      case 3:
        return 'Senior';
        break;
      case 4:
        return 'Specialist';
        break;
      case 5:
        return 'Professor';
        break;
    }
  }

}
