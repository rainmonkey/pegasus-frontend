import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment.js'

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value).startOf('hour').fromNow();
  }

}
