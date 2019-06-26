import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IsTemporary'
})
export class IsTemporaryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value){
      case 1:
      return "Yes"
      break;
      case 0:
        return "No"
        break;
  }
  }

}
