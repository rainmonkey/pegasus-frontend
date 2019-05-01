import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDetail } from '../../models/UserDetail';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<UserDetail>;
    public currentUser: Observable<UserDetail>;
    // Gets Base URL
    baseUrl = environment.baseUrl;


    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserDetail>(JSON.parse(localStorage.getItem('current')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserDetail {
        return this.currentUserSubject.value;
    }

    // login response
    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'login/', { username, password })
        .pipe(map(data => {
            // login successful if there's a jwt token in the response
            if (data.IsSuccess && data.Data) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('currentUser', JSON.stringify(data.Data));
                this.loginSave('userToken', JSON.stringify(data.Data));
                this.currentUserSubject.next(data);
            }
            return data;
        }));
    }

    loginSave(a, b) {
        localStorage.setItem(a, b);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('userToken');
        this.currentUserSubject.next(null);
    }
}