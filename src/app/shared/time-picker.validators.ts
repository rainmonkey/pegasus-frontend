import {AbstractControl, ValidatorFn} from '@angular/forms';

// export const timePickerValidator = (): ValidatorFn => {
//   return (control: AbstractControl): {[key: string]: any}|null => {
//     const minutes = Number(control.value.split(':')[1]);
//     console.log(minutes)
//     return minutes % 15 != 0 ? {'forbidden': {value: 'Time slot must be every 15 mins'}} : null;
//   };
// }


export const timePickerValidator = (control: AbstractControl) =>{
  const minutes = Number(control.value.split(':')[1]);
  return minutes % 15 != 0 ? {'forbidden': {value: 'Time slot must be every 15 mins'}} : null;
}
