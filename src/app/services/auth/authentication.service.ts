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
        let token = localStorage.getItem('userToken')
        if(token){
            return true
        }
        else{
            return false
        }
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
        localStorage.setItem('userToken', res.Data);
    }

    // remove user from local storage to log user out
    logout() {
        localStorage.clear();
        sessionStorage.clear();
      }
}