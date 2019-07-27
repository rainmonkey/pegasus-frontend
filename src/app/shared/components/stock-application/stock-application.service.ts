import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class StockApplicationService {
  
  private formSource = new BehaviorSubject(null);
  currentForm = this.formSource.asObservable();

  constructor() { }

  changeForm(message) {
    this.formSource.next(message)
  }
 
}
