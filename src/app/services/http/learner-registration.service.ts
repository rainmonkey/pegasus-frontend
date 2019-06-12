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
  // post url
  // public url = this.baseUrl + 'api/learner';
  public url = 'http://192.168.178.76:5000/api/learner';

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
  getTeacherFilter(id): Observable<any> {
    return this.http.get(this.baseUrl + 'TeacherFilter/' + id);
  }
  // post student's data to server and catch error from server
  postStudent(student: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'learner', student)
               .pipe(
                 catchError(this.errorHandler)
               );
  }
// post student's data to server and catch error from server
  putStudent(learnerId:number,student: any): Observable<any> {
  return this.http.put<any>(this.baseUrl + 'learner/' + learnerId, student)
             .pipe(
               catchError(this.errorHandler)
             );
}
// add 121 course to exit learner
  add121Course(course){
    return this.http.post(this.baseUrl + 'OnetoOneCourseInstance', course);
  }
// add group course to exit learner
  addGroupCourse(group){
    return this.http.post(this.baseUrl + 'learnerGroupCourse', group);
  }

  // throw error to component
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
