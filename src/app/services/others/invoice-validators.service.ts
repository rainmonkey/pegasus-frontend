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
    if (control["controls"].hasOwnProperty("Other4Fee")) {
      name = control.get(['Other4FeeName']);
      fee = control.get(['Other4Fee']);
    }
    if (control["controls"].hasOwnProperty("Other5Fee")) {
      name = control.get(['Other5FeeName']);
      fee = control.get(['Other5Fee']);
    }
    if (control["controls"].hasOwnProperty("Other6Fee")) {
      name = control.get(['Other6FeeName']);
      fee = control.get(['Other6Fee']);
    }
    if (control["controls"].hasOwnProperty("Other7Fee")) {
      name = control.get(['Other7FeeName']);
      fee = control.get(['Other7Fee']);
    }
    if (control["controls"].hasOwnProperty("Other8Fee")) {
      name = control.get(['Other8FeeName']);
      fee = control.get(['Other8Fee']);
    }
    if (control["controls"].hasOwnProperty("Other9Fee")) {
      name = control.get(['Other9FeeName']);
      fee = control.get(['Other9Fee']);
    }
    if (control["controls"].hasOwnProperty("Other10Fee")) {
      name = control.get(['Other10FeeName']);
      fee = control.get(['Other10Fee']);
    }
    if (control["controls"].hasOwnProperty("Other11Fee")) {
      name = control.get(['Other11FeeName']);
      fee = control.get(['Other11Fee']);
    }
    if (control["controls"].hasOwnProperty("Other12Fee")) {
      name = control.get(['Other12FeeName']);
      fee = control.get(['Other12Fee']);
    }
    if (control["controls"].hasOwnProperty("Other13Fee")) {
      name = control.get(['Other13FeeName']);
      fee = control.get(['Other13Fee']);
    }
    if (control["controls"].hasOwnProperty("Other14Fee")) {
      name = control.get(['Other14FeeName']);
      fee = control.get(['Other14Fee']);
    }   
    if (control["controls"].hasOwnProperty("Other15Fee")) {
      name = control.get(['Other15FeeName']);
      fee = control.get(['Other15Fee']);
    }
    if (control["controls"].hasOwnProperty("Other16Fee")) {
      name = control.get(['Other16FeeName']);
      fee = control.get(['Other16Fee']);
    }    
    if (control["controls"].hasOwnProperty("Other17Fee")) {
      name = control.get(['Other17FeeName']);
      fee = control.get(['Other17Fee']);
    }         
    if (control["controls"].hasOwnProperty("Other18Fee")) {
      name = control.get(['Other18FeeName']);
      fee = control.get(['Other18Fee']);
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
