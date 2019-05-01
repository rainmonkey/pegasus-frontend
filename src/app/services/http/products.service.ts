import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl: any = environment.baseUrl;
  constructor(private http: HttpClient) { }

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
    return this.http.post(this.baseUrl + 'prod', prod);
  }
}
