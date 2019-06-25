import { Injectable } from '@angular/core';
import { AbstractControl } from "@angular/forms"

@Injectable({
  providedIn: 'root'
})
export class InvoiceValidatorsService {

  constructor() { }

  matcher(control: AbstractControl): { [key: string]: any } {
    let name, fee
    if (control["controls"].hasOwnProperty("Other1Fee")) {
      name = control.get(['Other1FeeName']);
      fee = control.get(['Other1Fee']);
    }
    if (control["controls"].hasOwnProperty("Other2Fee")) {
      name = control.get(['Other2FeeName']);
      fee = control.get(['Other2Fee']);
    }
    if (control["controls"].hasOwnProperty("Other3Fee")) {
      name = control.get(['Other3FeeName']);
      fee = control.get(['Other3Fee']);
    }
    if (control["controls"].hasOwnProperty("NoteFee")) {
      name = control.get(['LessonNoteFeeName']);
      fee = control.get(['NoteFee']);
    }
    if (control["controls"].hasOwnProperty("ConcertFee")) {
      name = control.get(['ConcertFeeName']);
      fee = control.get(['ConcertFee']);
    }

    if (name.value && !fee.value) {
      return { fillFee: true };
    }
    if (!name.value && fee.value) {
      return { fillFeeName: true }
    }
    return null
  }
}
