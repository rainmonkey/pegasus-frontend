import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from 'src/app/services/http/inventories.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { StockApplicationUpdateModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-update-modal/stock-application-update-modal.component';
import { StockApplicationDetailModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-detail-modal/stock-application-detail-modal.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-stock-application-list',
  templateUrl: './stock-application-list.component.html',
  styleUrls: ['./stock-application-list.component.css']
})

export class StockApplicationListComponent implements OnInit {
  /* get props from HTML # template reference variable */
  @ViewChild('pagination') pagination: any;

  /* loading */
  public loadingFlag: boolean = true;
  public page: number = 1;
  public pageSize: number = 8;
  public dateForm: FormGroup;
  /* props for after loading, display default data of three months */
  public previousDate: any;
  public currentDate: any;
  /* props for validating EndDate > BeginDate */
  public fromDate: NgbDate;
  public toDate: NgbDate;
  /* props from user selection for getting data from server */
  public beginDate: any;
  public endDate: any;
  /* props for accepting data from server */
  public stockApplication: Array<any>;
  public errorMessage: string;
  /* all about route of URL */
  public queryParams: object = {};
  /* delete method */
  public timeout: any;
  public isDeleted: boolean = false;
  public deleteFailed: boolean = false;
  // public isHighlight: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private inventoriesService: InventoriesService,
    private ngTableService: NgbootstraptableService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    /* before get data from server, renders loading flag */
    this.loadingFlag = true;
    /* get three months data from server the first time accesses the web page */
    this.getThreeMonths();
    this.getStockApplication(this.previousDate, this.currentDate);
    this.dateForm = this.fb.group({
      beginDate: ['', Validators.pattern('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')],
      endDate: ['', Validators.pattern('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')]
    })
  }

  /* get previous three months */
  getThreeMonths() {
    let today = new Date();
    today.setDate(today.getDate() + 1)
    this.currentDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    let previousThreeMonths = today.setMonth(today.getMonth() - 3)
    this.previousDate = this.datePipe.transform(previousThreeMonths, 'yyyy-MM-dd');
  }
  /* get stock application data from server */
  getStockApplication(previousDate: any, currentDate: any) {
    this.inventoriesService.getStockApplication(previousDate, currentDate).subscribe(
      (res) => {
        console.log('res', res.Data);
        this.stockApplication = res.Data;
        this.loadingFlag = false;
         console.log('this.stockApplication', this.stockApplication)
      },
      (err) => {
        this.errorHandler(err);
      }
    )
  }
  /* slice specific part of data to display in table of HTML */
  get stockApplications(): any[] {
    // console.log('sddsfasdfsaf', this.stockApplication)
    if (!this.loadingFlag) {
      // console.log('sddsfasdfsaf', this.stockApplication)
      return this.stockApplication.reverse()
        .map((stockInfo, i) => ({ id: i + 1, ...stockInfo }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }
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
  /* update modal */
  updateModal(command: number, whichOrder: number) {
    console.log('update command', command, 'whichOrder', whichOrder)
    const modalRef = this.modalService.open(StockApplicationUpdateModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    modalRef.componentInstance.passProduct.subscribe((applicationId: number) => {
      this.loadingFlag = true;
      this.inventoriesService.getNewStockApplication(applicationId).subscribe(
        res => {
          console.log('receivedProduct', res['Data']);
          this.stockApplication.push(res['Data']);
          // console.log('stockApplications',this.stockApplications);
          this.loadingFlag = false;
          modalRef.close();
        },
        err => this.errorHandler(err)
      )
    })
  }
  /* detail modal */
  detailModal(command: number, whichOrder: number) {
    console.log('detail command', command, 'whichOrder', whichOrder)
    const modalRef = this.modalService.open(StockApplicationDetailModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
  }
  /* delete method */
  delete(whichOrder) {
    // document.querySelector('.table_row--highlight').style.backgroundColor = "red";
    let applicationId = whichOrder.ApplicationId;
    this.isDeleted = true;
    whichOrder.isHighlight = true;
    this.timeout = setTimeout(() => {
      this.inventoriesService.deleteProduct(applicationId).subscribe(
        res => {
          console.log('delete res', res);
          this.isDeleted = false;
          let index = this.stockApplication.indexOf(applicationId);
          this.stockApplication.splice(index, 1);
          whichOrder.isHighlight = false;
          document.querySelector('.table_row--highlight')['style'].background = "";
        },
        err => {
          this.deleteFailed = true;
          this.errorHandler(err);
        }
      )
    }, 500000)
  }
  undo() {
    this.isDeleted = false;
    clearTimeout(this.timeout);
  }
  /* reusable function */
  errorHandler(err: any) {
    console.warn(err);
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    } else {
      this.errorMessage = 'Error! Can not catch Data!';
    }
  }
  /* validate dateForm input */
  
  
 
}
