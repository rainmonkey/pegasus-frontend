import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Reason'
})
export class ReasonLearnPianoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
      return "To pass grade exams"
      break;
      case 2:
      return "To be a professional pianist"
      break;
      case 3:
      return "To be goot at the piano"
      break;
      case 4:
      return "For interest"
      break;
      case 5:
      return "My parents want me to"
      return
      case 6:
      return "I have no idea"
      break
    }
  }

}
