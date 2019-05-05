import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators'
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class LearnersService {

  private baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getLearners(name): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'learner/' + name)
    .pipe(
      catchError(this.errorHandler)
    );
  }
   errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
   }
}
