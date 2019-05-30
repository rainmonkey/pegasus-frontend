import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isUnder18'
})
export class IsUnder18Pipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value){
      case 0:
      return "No"
      break;
      case 1:
        return "Yes"
        break;
    }
  }

}
