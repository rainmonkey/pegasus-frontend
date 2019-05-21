import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnTitleFormat'
})
export class ColumnTitleFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/(?=[A-Z])/g, ' ');
  }

}