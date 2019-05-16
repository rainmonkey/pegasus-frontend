import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class LearnerListService {
  private baseUrl: any = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getLearnerList() {
    return this.http.get(this.baseUrl + 'learner')
  }
}
