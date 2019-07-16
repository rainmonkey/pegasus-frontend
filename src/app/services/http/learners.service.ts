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
  token: string

  private baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // API Request headers
  prepareHeaders() {
    this.token = localStorage.getItem('Token')
    this.httpHeaders = new HttpHeaders({ 'Authorization': "" + localStorage.getItem('Token') })
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

  getLearnerList() {
    return this.http.get(this.baseUrl + 'learner')
  }

  getLearnerById(id) {
    return this.http.get(this.baseUrl + 'learner/GetLearnerById/'+id)
  }
  getLearnerByIdTimePick(id) {
    return this.http.get(this.baseUrl + 'lesson/GetLessonsForLearner/'+id)
  }

  deleteLearner(LearnerId): any {
    return this.http.delete(this.baseUrl + 'learner/' + LearnerId);
  }

  //get learn form data
  getLookups(typeId: number): Observable<any> {
    return this.http.get(this.baseUrl + 'lookups/' + typeId);
  }

  learnerDayOff(dayOffModel) {
    return this.http.post(this.baseUrl + 'LearnerDayOff', dayOffModel);
  }

  GetOrgRoom() {
    return this.http.get(this.baseUrl + 'Orgs/OrgAndRoom');
  }

  PeriodCourseChange(model) {
    return this.http.post(this.baseUrl + 'PeriodCourseChange', model);
  }

  getRemainingCourses(LearnerId: number): Observable<any> {
    return this.http.get(this.baseUrl + "session/GetMakeupSessions/" + LearnerId)
  }

  getArrangedLesson(LearnerId: number): Observable<any> {
    return this.http.get(this.baseUrl + "Lesson/" + "GetArrangedLessonsByLearner/" + LearnerId)
  }

  getTeachers() {
    return this.http.get(this.baseUrl + 'teacher');
  }

  getLearnerPayment(learnerId ){
    return this.http.get(this.baseUrl+'Payment/'+'PaymentByLearner/'+learnerId )
  }

  getLearnerInvoice(learnerId){
    return this.http.get(this.baseUrl+'Invoice/'+ learnerId)
  }

  getLearnerLesson(learnerId){
    return this.http.get(this.baseUrl+'Lesson/'+'GetLessonsForLearner/'+learnerId)
  }
}
