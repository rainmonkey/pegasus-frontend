import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    // Gets Base URL
    baseUrl = environment.baseUrl;


    constructor(private http: HttpClient){}

    // Check users local storage for login status
    checkLoginStatus(){
        let token = localStorage.getItem('Token')
        if(token){
            return this.checkTokenExpiry()
        }
        else{
            return false
        }
    }

    // Check tokens expire time
    checkTokenExpiry(){
        let tokenExpireTime = Number(localStorage.getItem('TokenExpiry'))
        let now = Number((new Date()).getTime()/1000);
        if(tokenExpireTime > now ){
            return true
        }else{
            return false
        }
    }


    // login response
     login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'login', { username, password })
        .pipe(map(res => {
            // login successful if there's a jwt token in the response
            if (res.IsSuccess && res.Data) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.loginSave(res);
            }
            return res;
        }));
    }

    // Saves returned objects into storage
    loginSave(res) {
        console.log(res)
        localStorage.setItem('Token', res.Data.token);
        localStorage.setItem('TokenExpiry', res.Data.expires);
        localStorage.setItem('Role', res.Data.roleid);
        localStorage.setItem('userFirstName', res.Data.userdetails.firstname);
        localStorage.setItem('userLastName', res.Data.userdetails.lastname);
        localStorage.setItem('userPosition', res.Data.userdetails.position);
        localStorage.setItem('organisations', res.Data.userdetails.OrgName);
        localStorage.setItem('userID', res.Data.userid);
        localStorage.setItem('userName', res.Data.username);
        localStorage.setItem('OrgId',JSON.stringify(res.Data.userdetails.OrgId));
        if (res.Data.photo)  localStorage.setItem('photo',res.Data.photo);
        if (res.Data.userdetails.staffId) localStorage.setItem('staffId', res.Data.staffId);

    }

    // remove user from local storage to log user out
    logout() {
        localStorage.clear();
        sessionStorage.clear();
    }

    //change password
    changePassword(info){
        return this.http.put<any>( this.baseUrl+'changepassword', info )
    }

    userState(){
      let user = 1
      return user;
    }
}
