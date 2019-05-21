import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class LearnersService {
  httpHeaders: HttpHeaders;
  token:string
  
  private baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    this.httpHeaders = new HttpHeaders({'Authorization': ""+ localStorage.getItem('Token')})
  }

  getLearners(name) {
  return this.http.get<any[]>(this.baseUrl + 'learner/' + name)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   );
  // }
  //  errorHandler(error: HttpErrorResponse){
  //   return Observable.throw(error.message || "Server Error");
  //  }
  }

  getLearnerList(){
    return this.http.get(this.baseUrl+'learner')
  }


  deleteLearner(LearnerId):any{
    return this.http.delete(this.baseUrl + 'learner/' + LearnerId);
  }
 
}
