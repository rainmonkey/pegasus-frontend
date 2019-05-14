import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ProdType'
})
export class ProdTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 1:
      'book';
      break;
      case 2:
      'instrument';
      break;
      case 3:
      'gift';
      break;
    }
  }

}
