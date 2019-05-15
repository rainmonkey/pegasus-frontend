import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class LearnerRegistrationService {
  
  private baseUrl: any = environment.baseUrl;
  public url = this.baseUrl + 'register/student/';

  constructor(private http: HttpClient) { }

  //get learn form data
  getLookups(typeId: number): Observable<any> {
    return this.http.get(this.baseUrl + 'lookups/'+ typeId);
  }
  // get group course data from server
  getGroupCourse(): Observable<any> {
    return this.http.get(this.baseUrl + 'GroupCourseInstance');
  }
  //get location/branch data
  getOrgs(): Observable<any> {
    return this.http.get(this.baseUrl + 'orgs');
  }
  getTeacherFilter(): Observable<any> {
    return this.http.get(this.baseUrl + 'TeacherFilter');
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