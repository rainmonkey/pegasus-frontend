import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PostProduct } from 'src/app/models/ApplyProduct';

@Injectable({
  providedIn: 'root'
})
export class InventoriesService {
  private baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) { }

  addNew(data): any {
    return this.http.post(this.baseUrl + 'StockOrder', data)
  }
  /* For dropdown options*/
  getProdts() {
    return this.http.get(this.baseUrl + 'Product');
  }
  getOrgs() {
    return this.http.get(this.baseUrl + 'Orgs');
  }
  getQtyPriceReceipt() {
    return this.http.get(this.baseUrl + 'StockOrder');
  }
  getStaff() {
    return this.http.get(this.baseUrl + 'Staff');
  }

  /* get stock-application data from server*/
  getStockApplication(beginDate: any, endDate: any ): Observable<any> {
    return this.http.get(this.baseUrl + `StockApplication/${beginDate}/${endDate}`);
  }

  /* for stock-application-detail-modal dropdown options */
  getProdCats(): Observable<any> {
    return this.http.get(this.baseUrl + `Product/GetCat`);
  }
  getProdTypeByCat(cateId: number): Observable<any> {
    return this.http.get(this.baseUrl + `Product/GetTypeByCat/${cateId}`);
  }
  getProdByType(typeId: number): Observable<any> {
    return this.http.get(this.baseUrl + `Product/GetProdByType/${typeId}`);
  }

  /* post data  */
  postProduct(product: PostProduct): Observable<any>{
    return this.http.post(this.baseUrl, `StockApplication/${product}`)
           .pipe(
             catchError(this.errorHandler)
           );
  }
  // throw error to component
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
