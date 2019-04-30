import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserDetail } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<UserDetail>;
    public currentUser: Observable<UserDetail>;

    private url = 'http://45.76.123.59:5000/api/login';

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserDetail>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserDetail {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.url, { username, password })
        .pipe(map(data => {
            // login successful if there's a jwt token in the response
            if (data.IsSuccess) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('currentUser', JSON.stringify(data.Data));
                localStorage.setItem( username, JSON.stringify(data.Data));
                this.currentUserSubject.next(data);
            }
            return data;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
