import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processStatus'
})
export class ProcessStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value) {
      case 1:
        return 'Submited';
        break;
      case 2:
        return 'Approved';
        break;
      case 3:
        return 'denied';
        break;
      case 4:
        return 'delived';
        break;
      case 5:
        return 'received';
        break;
    };
  }

}

