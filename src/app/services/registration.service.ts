import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  
  public url: string= 'http://192.168.178.76:5000/api/register1/student';

  constructor(private _http: HttpClient) { }

  postLearner(student: any): Observable<any> {
    return this._http.post<any>(this.url, student)
               .pipe(
                 catchError(this.errorHandler)
               )
  }
  
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
