import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = environment.baseUrl;
  token:string
  httpHeaders: HttpHeaders;

  constructor(
    private http: HttpClient
    ) { }
  
  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')})
  }

  getProdType() {
    return this.http.get<any[]>(this.baseUrl + 'product/getCat');
  }
  getProdCat(catId) {
    return this.http.get<any[]>(this.baseUrl + 'product/gettypebycat/' + catId);
  }
  getProdName(typeId) {
    return this.http.get(this.baseUrl + 'product/getProdByType/' + typeId);
  }
  getProdItem(prodId) {
    return this.http.get(this.baseUrl + 'product/' + prodId);
  }

  postProdService(prod) {
    return this.http.post(this.baseUrl + 'payment/SaveProdPayment', prod);
  }

}
