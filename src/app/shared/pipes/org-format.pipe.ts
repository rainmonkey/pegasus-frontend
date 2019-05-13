import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orgFormat'
})
export class OrgFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
        return "Central Auckland Branch";
        break;
      case 2:
        return "Epsom Branch";
        break;
      case 3:
        return "Henderson Branch";
        break;
      case 4:
        return "North Shore Branch";
        break;
      case 5:
        return "AMA Pakuranga Branch";
        break;
      case 6:
        return "Auckland City Branch";
        break;
      case 7:
        return "East Auckland Branch";
        break;
      }
    }

}
