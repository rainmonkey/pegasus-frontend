import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TrialCoursesService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get courses taught by a teacher.
   * @param teacherId - teacher's ID
   */
  getTeacherCoursesbyId(teacherId: number) {
    return this.http.get(this.baseUrl + 'lesson/GetLessonsTeacherId/' + teacherId);
  }

  getTeacherbyRoomId(orgId: number,roomId: number,startTime: string) {
    return this.http.get(this.baseUrl + 'TrialLesson/GetTeacher/' + orgId+'/'+roomId+'/'+startTime);
  }

  /**
   * Get terms duration time (start time & end time)
   */
  getTermsDuration() {
    return this.http.get(this.baseUrl + 'Term');
  }

  getAvailableRoom(orgId: number, startTimeStr: string, endTimeStr: string) {
    return this.http.get(this.baseUrl + 'RoomAvailableCheck/checkbylesson/' + orgId + '/' + startTimeStr + '/' + endTimeStr);
  }

  /**
   * Get room that teacher often use.
   * @param teacherId - teacher ID
   * @param orgId - org ID
   * @param beginTime - begain time
   */
  getTeacherFrequentlyRoom(teacherId: number, orgId: number, beginTime: any) {
    return this.http.get(this.baseUrl + `Room/${teacherId}/${orgId}/${beginTime}`);
  }

  /**
   * Get learner object by learn ID.
   * @param learnerId - learner ID
   */
  getLearnerById(learnerId: number) {
    return this.http.get(this.baseUrl + 'Learner/GetLearnerById/' + learnerId);
  }

  /**
   * Get courses provided by this school.
   * /api/Courses
   */
  getCourses() {
    return this.http.get(this.baseUrl + 'Courses');
  }

  /**
   * Get extra fee (trail course has an extra fee).
   */
  getExtraFee() {
    return this.http.get(this.baseUrl + 'Lookups/' + '17')
  }

  /**
   * Get payment methods (types).
   */
  getPaymentMethods() {
    return this.http.get(this.baseUrl + 'Lookups/' + '7')
  }

  /**
   * Post a new trial course
   * @param data data to submit
   */
  postTrialCourse(data) {
    return this.http.post(this.baseUrl + 'TrialLesson', data);
  }
}
