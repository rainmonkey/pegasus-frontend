import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PostProduct } from 'src/app/models/PostProduct';

@Injectable({
  providedIn: 'root'
})
export class InventoriesService {
  private baseUrl: any = environment.baseUrl;
  // Observable replyMsg source
  private replyMsgSource = new BehaviorSubject<string>('');
  // Observable replyMsg stream
  replyMsg$ = this.replyMsgSource.asObservable();
  // service command
  changeReplyMsg(msg) {
    this.replyMsgSource.next(msg);
  }
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
  getNewStockApplication(applicationId: number) {
    return this.http.get(this.baseUrl + `StockApplication/getById/${applicationId}`);
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
    return this.http.post(this.baseUrl + 'StockApplication', product)
           .pipe(
             catchError(this.errorHandler)
           );
  }
  /* put data */
  putProduct(applicationId: number, product: PostProduct):  Observable<any> {
    return this.http.put(this.baseUrl + 'StockApplication/'+ applicationId, product)
  }
  // throw error to component
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
  /* delete data */
  deleteProduct(applicationId: number):  Observable<any> {
    return this.http.delete(this.baseUrl + `StockApplication/${applicationId}`)
  }
  /* deliver */ 
  deliverProduct(product) {
    return this.http.put(this.baseUrl + 'StockApplication/deliver', product)
  }
  /* reply */
  replyContent(applicationId, replyContent, applyAt) {
    return this.http.put(this.baseUrl + `StockApplication/reply/${applicationId}/${replyContent}/${applyAt}`, replyContent, applyAt)
  }
}
