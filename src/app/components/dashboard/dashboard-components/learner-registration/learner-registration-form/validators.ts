import { AbstractControl } from '@angular/forms';

export function ngtimepickerValidator(control: AbstractControl) {
  if (control && (control.value !=null || control.value != undefined)) {
    const minute = [0, 15, 30, 45];
    const hour = Number(control.value.hour);
    const tryTimeFormat = hour >= 7 && hour < 24 && minute.includes(Number(control.value.minute));
    if ( !tryTimeFormat ){
      return {
        isError : true
      };
    }
  }
  return null;
}
