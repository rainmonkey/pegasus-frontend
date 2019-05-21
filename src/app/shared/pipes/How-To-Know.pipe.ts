import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'knowMethods'
})
export class HowToKnowPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 1:
      return "From Friends"
      break;
      case 2:
      return "NZ Herald"
      break;
      case 3:
      return "Mandarin Times"
      break;
      case 4:
      return "Chinese Herald"
      break;
      case 5:
      return "New Times"
      break;
      case 6:
      return "Yellow Pages"
      break;
      case 7:
      return "Central Leader"
      break;
      case 8:
      return "Aucklander"
      break;
      case 9:
      return "900 Degree"
      break;
      case 10:
      return "GrabOne"
      break;
      case 11:
      return "Able Music"
      break;
      case 12:
      return "Finda"
      break;
      case 13:
      return "Facebook"
      break;
      case 14:
      return "Google"
      break;
    }
  }

}
