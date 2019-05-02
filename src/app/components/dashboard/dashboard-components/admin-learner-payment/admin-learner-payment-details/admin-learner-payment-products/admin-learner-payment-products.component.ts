import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NgControl, Form } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from 'src/app/services/http/products.service';
import { LearnersService } from '../../../../../../services/http/learners.service';
@Component({
  selector: 'app-admin-learner-payment-products',
  templateUrl: './admin-learner-payment-products.component.html',
  styleUrls: ['./admin-learner-payment-products.component.css']
})
export class AdminLearnerPaymentProductsComponent implements OnInit {

  // products
  public productName: any;
  public types = [];
  public typeItem = [];
  public categories = [];
  public catItem = [];
  public prodMuti = [];
  public prods = [];
  public prodItems = [];
  public prodItem = [];
  public prodCatId;
  public prodTypeId: number;
  public productId;
  public payProducts = [1];
  public sectionCount = 1;
  public postProdPayObj;
  public addOptionCount = 0;
  public userSelcProd = [];
  public userProd;
  public sellPrice = 0;
  public sellPriceArr = [];
  // ng-modal variable
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private productsListService: ProductsService,
    private fb: FormBuilder,
    config: NgbTabsetConfig
  ) {
    // bootstrap tabset
    config.justify = 'center';
    config.type = 'pills';
  }

  ngOnInit() {
  }

}
