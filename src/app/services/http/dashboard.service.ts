import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl: any = environment.baseUrl;

  // for notification 
  private popupSource = new BehaviorSubject<boolean>(true);
  popup$ = this.popupSource.asObservable();

  constructor(private http: HttpClient) { }
  // get recent registration data
  getStatistic(brunchArray) {
    return this.http.get<any>(this.baseUrl + 'dashboard/' + brunchArray);
  }
  // get notification from server
  getMessages(staffId: number) {
    return this.http.get(`${this.baseUrl}Notice/${staffId}`);
  }
  // put notification data 
  putMessages(staffId, noticeId, type) {
    return this.http.put(`${this.baseUrl}Notice/${staffId}/${noticeId}/${type}`, null);
  }
  // close notification popup while click on the window
  closePopup(closeNotification: boolean) {
    this.popupSource.next(closeNotification)
  }
}


