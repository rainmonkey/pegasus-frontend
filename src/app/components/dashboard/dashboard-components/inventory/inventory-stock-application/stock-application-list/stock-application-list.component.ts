import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { NgbDate, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';

@Component({
  selector: 'app-stock-application-list',
  templateUrl: './stock-application-list.component.html',
  styleUrls: ['./stock-application-list.component.css']
})
export class StockApplicationListComponent implements OnInit {

  /* loading */
  public loadingFlag: boolean = true;
  public stockApplicationLength: number;
  public page: number = 1;
  public pageSize: number = 3;
  /* search type*/
  public searchType: Array<string> = ['FirstName', 'ApplyAt', 'AppliedQty', 'ProductName'];
  /* after loading, display default data of three months */
  public currentDate: any;
  public formerDate: any;
  /* props for validating EndDate > BeginDate */
  public fromDate: NgbDate;
  public toDate: NgbDate;
  /* props as params for getting data from server */
  public beginDate: any;
  public endDate: any;
  /* props refer to data from server */
  public stockApplication;
  public stockApplicationCopy;
  public errorMessage: string;
  /*other */
  public queryParams: object = {};
  @ViewChild('pagination') pagination;

  constructor(
    private inventoriesService: InventoriesService,
    private ngTableService: NgbootstraptableService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    
  }

  ngOnInit() {
    // this.loadingFlag = true;
    /* get value from user interaction and assign it to local props */

    /* get default three months' data the first time user accesses the web page */
    this.getThreeMonths();
    this.getStockApplication(this.formerDate, this.currentDate);
  }

  getThreeMonths() {
    let today = new Date();
    this.currentDate = today.toJSON().slice(0, 10);
    this.formerDate = new Date(today.setMonth(today.getMonth() - 3)).toJSON().slice(0, 10);
  }
  ///////////// Validate EndDate > BeginDate and search period's data////////////////////////////////////////
  onBeginDateSelect(beginDate: NgbDate) {
    if (beginDate.after(this.toDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.fromDate = beginDate;
      this.beginDate = `${beginDate.year}-${beginDate.month}-${beginDate.day}`;;
    }
  }
  onEndDateSelect(endDate: NgbDate) {
    if (endDate.before(this.fromDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.toDate = endDate;
      this.endDate = `${endDate.year}-${endDate.month}-${endDate.day}`;
    }
  }
  searchPeriod() {
    if (this.beginDate == null || this.endDate == null) {
      Swal.fire({
        title: 'Please check your input!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.getStockApplication(this.beginDate, this.endDate);
    }
  }
  ///////////////////////////////get stock application data from server//////////////////////////////////
  /* get stock application data from server */
  getStockApplication(beginDate: any, endDate: any) {
    console.log('params', this.beginDate, this.endDate);
    // test, will change to beginData and endDate
    this.inventoriesService.getStockApplication(beginDate, endDate).subscribe(
      (res) => {
        console.log('res', res.Data);
        this.stockApplication = res.Data;
        this.stockApplicationCopy = res.Data;
        this.stockApplicationLength = res.Data.length;
        this.loadingFlag = false;
      },
      (err) => {
        this.backendErrorHandler(err);
      }
    )
  }
  backendErrorHandler(err: any) {
    console.warn(err);
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can not catch Data!';
    }
  }
  ///////////////////// slice part of server data rendering in HTML //////////////////////////////////////////////
  get stockApplications(): any[] {
    if (!this.loadingFlag) {
      return this.stockApplication
        .map((stockInfo, i) => ({ id: i + 1, ...stockInfo }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
    sort method
  */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTableService.sorting(this.stockApplication, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
  }
 ///////////////////////////////////search method///////////////////////////////
 
  getCurrentPage() {
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage', currentPage)
  }
  /////////////////////////////set route query params//////////////////////////////////////////////

  /*
    stockInfos of queryParams:
      1, searchString
      2, searchBy
      3, orderBy
      4, orderControl
  */
  setQueryParams(paraName, paraValue) {
    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }
    this.router.navigate(['../stock-application'], {
      queryParams: this.queryParams,
      relativeTo: this.route
    });
  }
//////////////////////////////////////////////////////////////////////
  
}
