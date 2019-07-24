import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { StockApplicationAddModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-add-modal/stock-application-add-modal.component';
import { StockApplicationDetailModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-detail-modal/stock-application-detail-modal.component';

@Component({
  selector: 'app-stock-application-list',
  templateUrl: './stock-application-list.component.html',
  styleUrls: ['./stock-application-list.component.css']
})

export class StockApplicationListComponent implements OnInit {
  /* get props from HTML # variable template */
  @ViewChild('pagination') pagination: any;

  /* loading */
  public loadingFlag: boolean = true;
  public stockApplicationLength: number;
  public page: number = 1;
  public pageSize: number = 8;
  /* after loading, display default data of three months */
  public currentDate: any;
  public formerDate: any;
  /* props for validating EndDate > BeginDate */
  public fromDate: NgbDate;
  public toDate: NgbDate;
  /* props as params for getting data from server */
  public beginDate: any;
  public endDate: any;
  /* props accepts data from server */
  public stockApplication: Array<any>;
  public stockApplicationCopy: Array<any>;
  public errorMessage: string;
  /* all about route of URL */
  public queryParams: object = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private inventoriesService: InventoriesService,
    private ngTableService: NgbootstraptableService
  ) { }

  ngOnInit() {
    /* before get data from server, renders loading flag */
    this.loadingFlag = true;
    /* get three months data from server the first time accesses the web page */
    this.getThreeMonths();
    this.getStockApplication(this.formerDate, this.currentDate);
  }

  /* get three months */
  getThreeMonths() {
    let today = new Date();
    this.currentDate = today.toJSON().slice(0, 10);
    this.formerDate = new Date(today.setMonth(today.getMonth() - 3)).toJSON().slice(0, 10);
  }
  /* get stock application data from server */
  getStockApplication(beginDate: any, endDate: any) {
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

  /////////////////////////////rendering in HTML //////////////////////////////////////
  /* slice specific part of data to display in table of HTML */
  get stockApplications(): any[] {
    if (!this.loadingFlag) {
      return this.stockApplication
        .map((stockInfo, i) => ({ id: i + 1, ...stockInfo }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }
  /////////////////////////////event from HTML////////////////////////////////////////
  /* Validate EndDate > BeginDate */
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
  /* user interaction: select a period of time */
  selectPeriod() {
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
  /* sort method */
  onSort(orderBy: string, orderControls?: number) {
    let orderControl = this.ngTableService.sorting(this.stockApplication, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
  }
  /* refresh URL */
  getCurrentPage() {
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage', currentPage)
  }
  setQueryParams(paraName: string, paraValue: any) {
    this.queryParams[paraName] = paraValue;
    this.router.navigate(['../stock-application'], {
      queryParams: this.queryParams,
      relativeTo: this.route
    });
  }
  //////////////////////////////////////handler of angular-bootstrap modals/////////////////////////////////////
  openAddModal() {
    const modalRef = this.modalService.open(StockApplicationAddModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.passProduct.subscribe((applicationId: number) => {
      this.loadingFlag = true;
      this.inventoriesService.getNewStockApplication(applicationId).subscribe(
        res => {
          console.log('receivedProduct', res['Data']);
          this.stockApplication.unshift(res['Data']);
          this.loadingFlag = false;
        },
        err => this.backendErrorHandler(err)
      )
    })
  }
  openDetailModal() {
    const modalRef = this.modalService.open(StockApplicationDetailModalComponent, { size: 'lg', centered: true });
  }
  deleteModal() {
    
  }
}
