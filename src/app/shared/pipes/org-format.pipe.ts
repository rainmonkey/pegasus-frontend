import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orgFormat'
})
export class OrgFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args == 'abbr') {
      switch (value.toUpperCase()){
        case  "CENTRAL AUCKLAND BRANCH":
          return "Central";
          break;
        case "EPSOM BRANCH":
          return "Epsom";
          break;
        case "HENDERSON BRANCH":
          return "Henderson";
          break;
        case "NORTH SHORE BRANCH":
          return "North";
          break;
        case "AMA PAKURANGA BRANCH":
          return "Pakuranga";
          break;
        case "AUCKLAND CITY BRANCH":
          return "City";
          break;
        case "EAST AUCKLAND BRANCH":
          return "East";
          break;
      }
    }
    else {
      switch (value) {
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


}
