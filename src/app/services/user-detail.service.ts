import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/UserDetail';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private urlLocal: any = environment._url;
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  getUserDetail(usrAndPass): Observable<any> {
<<<<<<< HEAD
    return this._http.post<UserDetail>(this._url, usrAndPass);
=======
    return this._http.post<UserDetail>(this.urlLocal, usrAndPass);
>>>>>>> 2528882f694d93044aecf5ebe4f17b29564ce295
  }
}
