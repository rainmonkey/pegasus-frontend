import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MyType'
})
export class MyTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      console.log(args);
      switch (value) {
        case 1:
        return 'book';
        case 2:
        return 'instrument';
        case 3:
        return 'gift';
      }
    }
    if (args === 'status') {

      switch (value) {
        case 0:
        return 'waiting send';
        break;
        default:
        return 'sent';
      }
    }
  }

}
