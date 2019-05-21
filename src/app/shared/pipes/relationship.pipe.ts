import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relationship'
})
export class RelationshipPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
      return "Father";
      break;
      case 0:
      return "Mother";
      break;
      case 2:
      return "Other";
      break
    }
  }

}
