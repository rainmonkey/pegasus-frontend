import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()

export class LearnersListService {
  private _url: string = 'http://35.197.183.118:5000/api/';

  constructor(private http: HttpClient) {}

  getLearners(name): Observable<any[]>{
    return this.http.get<any[]>(this._url + 'learner/' + name);
  }
  getInvoice(id): Observable<any[]>{
    return this.http.get<any[]>(this._url + 'payment/invoice/' + id)
  }
  addFund(fund){
    return this.http.post(this._url + 'payment/payInvoice', fund, {responseType: 'text'});
  }

}

//http://192.168.178.76:5000/api/learner/

//http://music-api-test.herokuapp.com/learners?name=
