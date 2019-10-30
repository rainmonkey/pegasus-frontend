import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simplifyOrg'
})
export class SimplifyOrgPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
        return "Mt.Albert";
        break;
      case 2:
        return "Epsom";
        break;
      case 3:
        return "Henderson";
        break;
      case 4:
        return "Sunnynook";
        break;
      case 5:
        return "AMA";
        break;
      case 6:
        return "City";
        break;
      case 7:
        return "Botany";
        break;
      }
  }

}
