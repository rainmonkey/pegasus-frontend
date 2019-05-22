import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeneralRepoService {
  public errorMessage: string;

  fisrtName = new BehaviorSubject('Customer Name');

  constructor() { }


}
