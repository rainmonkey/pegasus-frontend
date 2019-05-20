import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeneralRepoService {
  fisrtName = new BehaviorSubject('Lyric');
  constructor() { }
}
