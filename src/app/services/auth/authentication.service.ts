import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
        let tokenExpireTime = localStorage.getItem('TokenExpiry')
        let now = new Date();
        return true
        // if(){
        //     return true
        // }else{
        //     return false
        // }
    }


    // login response
    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'login/', { username, password })
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
        localStorage.setItem('userPosition', res.Data.userdetails.role);
    }

    // remove user from local storage to log user out
    logout() {
        localStorage.clear();
        sessionStorage.clear();
      }
}