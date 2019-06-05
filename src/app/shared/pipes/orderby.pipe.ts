import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby',
  pure: true
})
export class OrderbyPipe implements PipeTransform {
  transform(value: any, propertyName: string): any[] {
      // value = value || [];    
      // return value.sort((a: any, b: any) => a[propertyName].localeCompare(b[propertyName]));
      if(!Array.isArray(value)){
        return;
      }  
      value.sort((a: any, b:any) => {
        if(a[propertyName] < b[propertyName]){
          return -1;
        } else if (a[propertyName] > b[propertyName]){
          return 1;
        } else {
          return 0;
        }
      });
      return value;
  }
}



