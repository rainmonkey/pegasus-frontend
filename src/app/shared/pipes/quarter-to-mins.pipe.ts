import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'QuarterToMins'
})
export class QuarterToMinsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
        return "15 mins";
      case 2:
        return "30 mins";
      case 3:
        return "45 mins";
      case 4:
        return "60 mins";
      default:
         return value+"Quarter";            
    }
  }

}
