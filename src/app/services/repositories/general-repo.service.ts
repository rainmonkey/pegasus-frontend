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
  // set path subject
  pathArraySubject = new BehaviorSubject([]);
  pathArray;
  pathAuth;
  // Gets Base URL
  baseUrl = environment.baseUrl;
  // search name component
  fisrtName = new BehaviorSubject('Customer Name');
  constructor(private http: HttpClient, ) {
  }
  // get pages authentation
  getPathById(RoleId): Observable<any> {
    return this.http.get(this.baseUrl + 'page', RoleId);
  }
  giveAuthToGuard(urlS){
    let localPath = localStorage.getItem('pathAuth');
    let pathArray = localPath.split(',');
    let pass = false;
    for (let i of pathArray) {
      if (urlS.indexOf(i) !== -1) {
        pass = true
      }
      break
    }
    if (pass = true){
      return true;
    } else return false;
        // return localPath.indexOf(urlS);
  }

    // let url: string = this.state.url;
    // let urlS = url.substring(1,url.length-0);
    // this.pathArraySubject.subscribe(
    //   res=>{
    //     let pathArrayTemp = res;

  // // check User auth
  pathAllowed(){
    let userState = localStorage.getItem('Role');
    this.getPathById(userState)
    .subscribe(
      res=>{
         let pathAllowed = res.Data;
         this.pathArray = pathAllowed.map(ele=>ele.Url);
         localStorage.setItem('pathAuth',this.pathArray);
         this.pathArraySubject.next(this.pathArray);
      },
      error=>{
      }
    )
  }
}
