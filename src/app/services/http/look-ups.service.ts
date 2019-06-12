import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LookUpsService {
  private baseUrl:any =  environment.baseUrl;

  constructor(private http:HttpClient) { }

  /*
    4: Level
    7: payment methods
    8: durations
  */
 
  getLookUps(id):any{
    return this.http.get(this.baseUrl + 'Lookups/' + id);
  }
}
