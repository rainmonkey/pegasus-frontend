import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup } from '@angular/forms';
import { InventoriesService } from 'src/app/services/http/inventories.service'

@Component({
  selector: 'app-stock-application-detail-modal',
  templateUrl: './stock-application-detail-modal.component.html',
  styleUrls: ['./stock-application-detail-modal.component.css']
})
export class StockApplicationDetailModalComponent implements OnInit {
  // @Input() name;

  public applicationFrom: FormGroup;
  /* for modal */
  public orgId: string;
  

  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private inventoriesService: InventoriesService) { }

  ngOnInit() {
    this.applicationFrom = this.fb.group(this.formGroupAssemble());
    this.getLocalStorage();
    this.getOrgs();
  }

  /* form group obj */
  formGroupAssemble() {
    return {
      staffName: ['', Validators.required],
      org: [this.orgId , Validators.required],
      applyAt: [new Date],
      applyReason: ['', Validators.required],
      productName: [null, Validators.required],
      productQty: [null, Validators.required]
    }
  }
  /* get data from local storage */
  getLocalStorage() {
    let orgIdArr = localStorage.getItem('staffId');
    this.orgId = orgIdArr[0];
  }
  /* get data from server */
  getOrgs() {
    this.inventoriesService.getOrgs().subscribe(
      res => {
        // res.Data 
        // this.orgs = res['Data'];
        // console.log('orgs', res)
      },
      err => console.log('err!', err)
    )
  }
}
