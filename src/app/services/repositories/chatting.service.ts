import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public baseUrl: any = environment.baseUrl;
  public subsOfStaffs;
  public subsOfTeachers;
  public subsOfStudents;
  public errorFlag: boolean;


  constructor(private http: HttpClient) { }

  //目前不同的权限调用的api不同 后台在改 到时候可以直接调用同一个api 后台进行判断 未完成
  getSubscribersList(userId) {
    //To avoid dulplicated data transfer, when the web initiate, call api from server(refresh, render or re-render don't call api)
    if(sessionStorage.chattingInit == 'true'){
      return;
    }
    else{ 
      this.http.get(this.baseUrl + 'Chat/GetStaffChattingList/' + userId).subscribe(
        (res) => {
          this.subsOfStaffs = res['Data'].Item1;
          this.subsOfTeachers = res['Data'].Item2;
          this.subsOfStudents = res['Data'].Item3;
          //console.log(this.subsOfStaffs);
          //set 'true' as a sign
          sessionStorage.setItem('chattingInit', 'true');
        },
        (err) => {
          //console.log(err)
          this.errorFlag = true;
        }
      ) 
    }
  }
}
