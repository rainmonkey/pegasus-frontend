import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { InventoriesService } from 'src/app/services/http/inventories.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { StockApplicationUpdateModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-update-modal/stock-application-update-modal.component';
import { StockApplicationDetailModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-detail-modal/stock-application-detail-modal.component';
import { StockApplicationReplyModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-reply-modal/stock-application-reply-modal.component';
import { StockApplicationDeliverModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-deliver-modal/stock-application-deliver-modal.component';
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
  public pageSize: number = 6;
  /* props for after loading, display default data of three months */
  public previousDate: any;
  public currentDate: any;
  public dateForm: FormGroup;
  /* props for validating EndDate > BeginDate */
  public fromDate: NgbDate;
  public toDate: NgbDate;
  /* props from user selection for getting data from server */
  public beginDate: any;
  public endDate: any;
  /* props for accepting data from server */
  public stockApplication: Array<any>;
  public stockApplicationCopy: Array<any>;
  public errorMessage: string;
  /* all about route of URL */
  public queryParams: object = {};
  /* props for modal */
  public timeout: any;
  public isDeleted: boolean = false;
  public deleteFailed: boolean = false;
  public applicationId: number;
  /* props for result of returned checkRole() */
  public headOfficeRole: boolean = false;
  /* for search method */
  public searchBy: string;

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
    this.headOfficeRole = this.checkRole()
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
 
  /* 
    check role from local storage, various roles show various info 
      1) if role === 3, then display branch pages
      2) if role === 9, then display head office pages
  */
  checkRole() {
    // now role is just hardcode, will get it from real value after creat a head office account
    let role = 9
    // let role = + localStorage.getstockInfo('Role');
    if(role === 9) return true
    else return false
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
    if(this.checkRole()) {
      this.inventoriesService.getStockApplication(previousDate, currentDate).subscribe(
        (res) => {
          // console.log('res', res['Data']);
          this.stockApplication = this.renderOrderList(res['Data']);
          this.stockApplicationCopy = res['Data'].map((stockInfo, i) => ({ id: i + 1, ...stockInfo }));
          this.loadingFlag = false;
        },
        (err) => {
          this.errorHandler(err);
        }
      )
    } else {
      this.inventoriesService.getStockApplication(previousDate, currentDate).subscribe(
        (res) => {
          // console.log('res', res['Data']);
          let orgId = +localStorage.getItem('OrgId')[1];
          this.stockApplication = this.renderOrderList(res['Data']).filter((stockInfo) => stockInfo.Org.OrgId === orgId);
          this.loadingFlag = false;
        },
        (err) => {
          this.errorHandler(err);
        }
      )
    }
  }
  /* err handler */
  errorHandler(err: any) {
    console.warn(err);
    if (err.error.ErrorMessage != null) this.errorMessage = err.error.ErrorMessage
    else this.errorMessage = 'Error! Can not catch Data!'
  }
  /* slice specific part of data to display in table of HTML */
  renderOrderList(orderList: any[]) {
    return orderList.reverse()
      .map((stockInfo, i) => ({ id: i + 1, ...stockInfo }))
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
  postStockApplication(modalRef: any) {
    modalRef.componentInstance.passApplicationId.subscribe(
      (applicationId: number) => {
        // this.loadingFlag = true;
        this.inventoriesService.getNewStockApplication(applicationId).subscribe(
          res => {
            console.log('post success', res['Data']);
            this.stockApplication.unshift(res['Data']);
            this.stockApplication.map((stockInfo, i) => stockInfo.id = i + 1);
            this.applicationId = applicationId;
            setTimeout(() => {
              this.applicationId = null;
            }, 2000)
            this.loadingFlag = false;
            modalRef.close();
          },
          err => this.errorHandler(err)
        )
      }
    )
  }
  putStockApplication(modalRef: any) {
    modalRef.componentInstance.updateApplication.subscribe(
      (res) => {
        // this.loadingFlag = true;
        console.log('put success', res);

        modalRef.close();
      },
      (err) => this.errorHandler(err)
    )
  }
  updateModal(command: number, whichOrder?) {
    const modalRef = this.modalService.open(StockApplicationUpdateModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    this.postStockApplication(modalRef);
    this.putStockApplication(modalRef);
  }
  /* detail modal */
  detailModal(command: number, whichOrder: any) {
    const modalRef = this.modalService.open(StockApplicationDetailModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
  }
  /* delete modal */
  delete(whichOrder: any) {
    this.isDeleted = true;
    this.applicationId = whichOrder.ApplicationId;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.inventoriesService.deleteProduct(this.applicationId).subscribe(
        res => {
          console.log('delete res', res);
          this.isDeleted = false;
          let index = this.stockApplication.indexOf(whichOrder);
          this.stockApplication.splice(index, 1);
          this.stockApplication.map((stockInfo, i) => stockInfo.id = i + 1);
        },
        err => {
          this.deleteFailed = true;
          this.errorHandler(err);
        }
      )
    }, 2000)
  }
  undo() {
    this.isDeleted = false;
    this.applicationId = null;
    clearTimeout(this.timeout);
  }
  /* reply modal */
  replyModal(command: number, whichOrder: any) {
    const modalRef = this.modalService.open(StockApplicationReplyModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
  }
  /* deliver */
  deliver(command: number, whichOrder: any) {
    const modalRef = this.modalService.open(StockApplicationDeliverModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
  }
  /* search staff name and location */
  search(text: string) {
    this.stockApplication = this.stockApplicationCopy;
    return this.stockApplication.filter(order => {
      const term = text.toLowerCase().trim();
      return order.ApplyStaff.FirstName.toLowerCase().includes(term)
          || order.Org.OrgName.toLowerCase().includes(term);
    });
  }
  keyup() {
    this.searchBy === ''? this.stockApplication = this.stockApplicationCopy: this.stockApplication = this.search(this.searchBy);
  }

}
