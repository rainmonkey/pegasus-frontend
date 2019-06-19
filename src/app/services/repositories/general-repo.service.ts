import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class GeneralRepoService {
  public errorMessage: string;
  // Gets Base URL
  baseUrl = environment.baseUrl;
  userState
  // search name component
  fisrtName = new BehaviorSubject('Customer Name');
  constructor(private http: HttpClient) { }
  // get user auth state
  getUser(){
    this.userState = 1;
    return
  }
  // check User auth
  checkUser(url){

  }
}
