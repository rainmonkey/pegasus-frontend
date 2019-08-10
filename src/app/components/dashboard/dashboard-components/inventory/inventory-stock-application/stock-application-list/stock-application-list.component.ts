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
import { StockApplicationReceiveModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-receive-modal/stock-application-receive-modal.component';
import { StockApplicationProcessModalComponent } from 'src/app/components/dashboard/dashboard-components/inventory/inventory-stock-application/stock-application-process-modal/stock-application-process-modal.component';

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
  public role: number;
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
  public applicationId: number;
  public processStatus: number;
  public headOfficeFlag: boolean = false;
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
    /* it will influence what info should render */
    this.headOfficeFlag = this.checkRole();
    /* before get data from server, render loading flag */
    this.loadingFlag = true;
    /* get three months data from server the first time accesses the web page */
    this.getThreeMonths();
    this.getStockApplication(this.previousDate, this.currentDate);
  }

  /* 
    check role from local storage, different role has different limit of permissions
      1) if role === 3, then display branch pages
      2) if role === 9 or role === 5, then display head office pages
  */
  checkRole() {
    // this.role = + localStorage.getorder('Role');
    // now just hardcode for test
    this.role = 3
    if (this.role === 5 || this.role === 9) return true
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
  /* slice specific part of data to display in table of HTML */
  renderOrderList(orderList: any[]) {
    return orderList.reverse()
      .map((order, i) => ({ id: i + 1, ...order }))
  }
  /* get stock application data from server */
  getStockApplication(previousDate: any, currentDate: any) {
    if (this.checkRole()) {
      this.inventoriesService.getStockApplication(previousDate, currentDate).subscribe(
        (res) => {
          this.stockApplication = this.renderOrderList(res['Data']);
          this.stockApplicationCopy = res['Data'].map((order, i) => ({ id: i + 1, ...order }));
          this.loadingFlag = false;
        },
        (err) => alert('Oops! Can not catch Data Now!')
      )
    } else {
      this.inventoriesService.getStockApplication(previousDate, currentDate).subscribe(
        (res) => {
          let orgId = +localStorage.getItem('OrgId')[1];
          this.stockApplication = this.renderOrderList(res['Data']).filter((order) => order.Org.OrgId === orgId);
          this.loadingFlag = false;
        },
        (err) => alert('Oops! Can not catch Data Now!')
      )
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
      let convertToDate = `${endDate.year}-${endDate.month}-${endDate.day}`;
      let tempConvertToDate = new Date(convertToDate)
      let tempEndDate = tempConvertToDate.setDate(tempConvertToDate.getDate() + 1)
      this.endDate = this.datePipe.transform(tempEndDate, 'yyyy-MM-dd')
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
    this.searchBy === '' ? this.stockApplication = this.stockApplicationCopy : this.stockApplication = this.search(this.searchBy);
  }
  /* update modal */
  postStockApplication(modalRef: any) {
    modalRef.componentInstance.passApplicationId.subscribe(
      (applicationId: number) => {
        this.inventoriesService.getNewStockApplication(applicationId).subscribe(
          res => {
            this.stockApplication.unshift(res['Data']);
            this.stockApplication.map((order, i) => order.id = i + 1);
            this.applicationId = applicationId;
            setTimeout(() => {
              this.applicationId = null;
            }, 2000)
            this.loadingFlag = false;
            Swal.fire({
              title: 'Successfully Add!',
              type: 'success',
              showConfirmButton: true,
            });
            modalRef.close();
          },
          err => alert('Oops! Update data failed!')
        )
      }
    )
  }
  putStockApplication(modalRef: any, whichOrder) {
    modalRef.componentInstance.updateApplication.subscribe(
      (res) => {
        this.inventoriesService.getNewStockApplication(res.ApplicationId).subscribe(
          res => {
            let index = this.stockApplication.indexOf(whichOrder);
            let updateRes = { id: index + 1, ...res['Data'] };
            this.stockApplication.splice(index, 1, updateRes);
            Swal.fire({
              title: 'Successfully Update!',
              type: 'success',
              showConfirmButton: true,
            });
            modalRef.close();
          },
          err => alert('Oops! Update Data failed')
        )
        modalRef.close();
      },
      (err) => alert('Oops! Update Data failed')
    )
  }
  updateModal(command: number, whichOrder?) {
    const modalRef = this.modalService.open(StockApplicationUpdateModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    this.postStockApplication(modalRef);
    this.putStockApplication(modalRef, whichOrder);
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
          this.isDeleted = false;
          let index = this.stockApplication.indexOf(whichOrder);
          this.stockApplication.splice(index, 1);
          this.stockApplication.map((order, i) => order.id = i + 1);
          Swal.fire({
            title: 'Successfully Delete!',
            type: 'success',
            showConfirmButton: true,
          });
        },
        err => alert('Oops! Delete Data failed')
      )
    }, 3000)
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
    this.updateReplyStatus(modalRef);
  }
  updateReplyStatus(modalRef) {
    modalRef.componentInstance.sendReplyRes.subscribe(
      res => {
        this.stockApplication.map((order) => {
          if (order.ApplicationId === res.ApplicationId) {
            order.ProcessStatus = res.ProcessStatus;
            order.ReplyContent = res.ReplyContent;
            order.ReplyAt = res.ReplyAt;
          }
        })
        Swal.fire({
          title: 'Successfully sent!',
          type: 'success',
          showConfirmButton: true,
        });
        modalRef.close();
      },
      err => alert('Oops! Reply Data failed')
    )
  }
  /* deliver modal */
  deliverModal(command: number, whichOrder: any) {
    const modalRef = this.modalService.open(StockApplicationDeliverModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    this.updateDeliverStatus(modalRef);
  }
  updateDeliverStatus(modalRef) {
    modalRef.componentInstance.sendDeliverRes.subscribe(
      res => {
        this.stockApplication.map((order) => {
          if (order.ApplicationId === res.ApplicationId) {
            order.ProcessStatus = res.ProcessStatus;
            order.DeliverAt = res.DeliverAt;
            order.ApplicationDetails.map((product) => {
              res.ApplicationDetails.map((prod) => {
                if (product.DetaillsId == prod.DetaillsId) {
                  product.DeliveredQty = prod.DeliveredQty
                }
              })
            })
          }
        })
        Swal.fire({
          title: 'Successfully sent!',
          type: 'success',
          showConfirmButton: true,
        });
        modalRef.close();
      },
      err => alert('Oops! Deliver failed')
    )
  }
  /* receive modal */
  receiveModal(command, whichOrder) {
    const modalRef = this.modalService.open(StockApplicationReceiveModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    this.updateReceiveStatus(modalRef);
  }
  updateReceiveStatus(modalRef) {
    modalRef.componentInstance.sendReceiveRes.subscribe(
      res => {
        this.stockApplication.map((order) => {
          if (order.ApplicationId === res.ApplicationId) {
            order.ProcessStatus = res.ProcessStatus;
            order.RecieveAt = res.RecieveAt;
            order.IsDisputed = res.IsDisputed;
            order.ApplicationDetails.map((product) => {
              res.ApplicationDetails.map((prod) => {
                if (product.DetaillsId == prod.DetaillsId) {
                  product.ReceivedQty = prod.ReceivedQty
                }
              })
            })
          }
        })
        Swal.fire({
          title: 'Successfully sent!',
          type: 'success',
          showConfirmButton: true,
        });
        modalRef.close();
      },
      err => alert('Oops! Receice failed')
    )
  }
  /* process modal */
  processModal(command, whichOrder) {
    const modalRef = this.modalService.open(StockApplicationProcessModalComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichOrder = whichOrder;
    modalRef.componentInstance.headOfficeFlag = this.headOfficeFlag;
    modalRef.componentInstance.role = this.role;
    this.cancelDispute(modalRef)
  }
  /* handle dispute if exits */
  cancelDispute(modalRef) {
    modalRef.componentInstance.sendDispute.subscribe(
      res => {
        this.stockApplication.map((order) => {
          order.IsDisputed = res.IsDisputed
        })
        Swal.fire({
          title: 'Successfully solve!',
          type: 'success',
          showConfirmButton: true,
        });
        modalRef.close()
      },
      err => alert('Oops! Can not cancel dispute!')
    )
  }
}
