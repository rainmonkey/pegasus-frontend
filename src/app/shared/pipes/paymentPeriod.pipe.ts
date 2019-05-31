import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentPeriod'
})
export class PaymentPeriodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 2:
        return "Week";
        break;
      case 1:
        return "Term";
        break;
  }

  }}
  
