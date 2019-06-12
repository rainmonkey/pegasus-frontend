import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';

import { InventoriesService } from '../../../../../services/http/inventories.service';
import { InventoryDetailModalComponent } from '../inventory-detail-modal/inventory-detail-modal.component';
import { InventoryRecieptModalComponent } from '../inventory-reciept-modal/inventory-reciept-modal.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
  providers: [DecimalPipe]
})
export class InventoryListComponent implements OnInit {
  public stockOrdersList: any;
  public stockOrdersListLength: number;
  public stockOrdersListCopy: Array<any>;
  public proName: any;
  public orgName: any;
  public staffName: any;
  public errorMessage: string;
  public closeResult: string;
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;  
  //loading
  public loadingFlag: boolean = false;

  //search by which columns, determine by users
  public currentPage: number = 1;
  public queryParams: object = {};
  public filter = new FormControl('');

  constructor(
    private inventoriesService: InventoriesService,
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingFlag = true;
    this.getData()
  }

  /*
    get data form serve
  */
  getData() {
    this.inventoriesService.getQtyPriceReceipt().subscribe(
      (res) => {
        this.stockOrdersList = res['Data'];
        this.stockOrdersListCopy = this.stockOrdersList;
        this.stockOrdersListLength = res['Data'].length; //length prop is under Data prop
        this.refreshPageControl();
        this.loadingFlag = false;
        console.log(this.stockOrdersList);
      },
      (err) => {
        this.backendErrorHandler(err);
      });
  }
  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = "Error! Can't catch Data.";
    }
  }

  /*
    update modal
  */
  addModal(command, whichStockOrder) {
    const modalRef = this.modalService.open(InventoryDetailModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichStockOrder = whichStockOrder;
  }

  /* 
    Reciept Image
  */
  imageModal(command, whichStockOrder) {
    const modalRef = this.modalService.open(InventoryRecieptModalComponent);
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit()
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichStockOrder = whichStockOrder;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /*
    items of queryParams:
      1, searchString
      2, searchBy
      3, orderBy
      4, orderControl
  */
  /*
    set the default params when after page refresh
  */
  refreshPageControl() {
    this.activatedRoute.queryParams.subscribe(res => {
      let { searchString, searchBy, orderBy, orderControl, currentPage } = res;
      if (searchString !== undefined && searchBy !== undefined) {
        this.onSearch(null, { 'searchString': searchString, 'searchBy': searchBy })
      }
      if (orderBy !== undefined && orderControl !== undefined) {
        this.onSort(orderBy, orderControl)
      }
      if (currentPage !== undefined) {
        this.currentPage = currentPage;
      }
    })
    return;
  }
  /*
    search method
  */
  onSearch(event, initValue?) {
    if (event !== null && !(event.type == 'keydown' && event.key == 'Enter')) {
      return;
    }
    else {
      let searchString: string;
      let searchBy: string;

      let searchingInputObj = document.getElementById('searchingInput');

      (initValue == undefined) ? { searchString, searchBy } =
        { searchString: searchingInputObj['value'], searchBy: 'ProductId' } :
        { searchString, searchBy } = initValue;

      this.stockOrdersList = this.ngTable.searching(this.stockOrdersListCopy, searchBy, searchString);
      this.stockOrdersListLength = this.stockOrdersList.length;

      this.setQueryParams('searchBy', searchBy);
      this.setQueryParams('searchString', searchString);
    }
  }
  /*
    sort method
  */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.stockOrdersList, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
  }
  setQueryParams(paraName, paraValue) {
    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }
    this.router.navigate(['inventory/list'], {
      queryParams: this.queryParams
    });
  }
}
