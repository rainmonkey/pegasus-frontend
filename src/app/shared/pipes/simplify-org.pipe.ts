import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simplifyOrg'
})
export class SimplifyOrgPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
        return "Central";
        break;
      case 2:
        return "Epsom";
        break;
      case 3:
        return "Henderson";
        break;
      case 4:
        return "North Shore";
        break;
      case 5:
        return "AMA Pakuranga";
        break;
      case 6:
        return "Auckland City";
        break;
      case 7:
        return "East Auckland";
        break;
      }
  }

}
