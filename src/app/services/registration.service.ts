import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // url given by back-end server
  public url = 'http://192.168.178.76:5000/api/register/student';

  constructor(private http: HttpClient) { }

  // get group course data from server
  getGroupCourse(): Observable<any> {
    return this.http.get('../assets/course.json');
  }

  // post student's data to server and catch error from server
  postStudent(student: any): Observable<any> {
    return this.http.post<any>(this.url, student)
               .pipe(
                 catchError(this.errorHandler)
               );
  }

  // throw error to component
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
