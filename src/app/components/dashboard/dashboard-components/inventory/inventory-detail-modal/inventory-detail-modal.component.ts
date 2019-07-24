import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoriesService } from '../../../../../services/http/inventories.service';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-detail-modal',
  templateUrl: './inventory-detail-modal.component.html',
  styleUrls: ['./inventory-detail-modal.component.css']
})
export class InventoryDetailModalComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;
  public infoMessage: string = '';
  public loadingGifFlag: boolean = false;
  public receiptFile: any;
  public updateForm: FormGroup;
  //Level dropdown options
  public productName: Array<any>;
  public staffData: any;
  public staffName: Array<any>;
  public orgData: any;
  public orgName: Array<any> = [];

  @Input() command;
  @Input() whichStockOrder;

  constructor(
    public activeModal: NgbActiveModal,
    private inventoriesService: InventoriesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group(this.formGroupAssemble());
    /* For Dropdown Options */
    this.getItemsName();
  }

  /*********** For Dropdown Options *************************************************/
  getItemsName() {
    this.inventoriesService.getProdts().subscribe(
      (res) => {
        this.productName = res['Data'];
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    );
    this.inventoriesService.getOrgs().subscribe(
      (res) => {
        this.orgData = res['Data'];
        this.filterOrg();
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    );
    this.inventoriesService.getStaff().subscribe(
      (res) => {
        this.staffData = res['Data'];
        this.staffData.forEach(element => {
          element.StaffFullName = element.FirstName + ' ' + element.LastName;
        })
        this.filterStaff();
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
          text:err.error.ErrorMessage
        });
        console.log(err.error.ErrorMessage);
      }
    )
  }
  // Filter Org selecting by localstorage
  filterStaff() {
    this.staffName = this.staffData.filter((item) => item.StaffId == localStorage.getItem('staffId'));
  }
  filterOrg() {
    for (let i = 0; i < JSON.parse(localStorage.getItem('OrgId')).length; i++) {
      this.orgName[i] = this.orgData.filter((item) => item.OrgId == JSON.parse(localStorage.getItem('OrgId'))[i])[0];
    }
  }

  /* Form Group*/
  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        ProductId: [null, Validators.required],
        OrgId: [null, Validators.required],
        Quantity: [null, Validators.required],
        BuyingPrice: [null, Validators.required],
        StaffId: [{ value: localStorage.getItem('staffId'), disabled: true }],
        ReceiptImg: [null, Validators.required]
      }
    }
    return groupObj;
  }

  /* Post form */
  onSubmit() {
    let valueToSubmit = this.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    if (vailadValue !== null && this.updateForm.dirty) {
      this.loadingGifFlag = true;
      this.stringifySubmitStr();
    } else if (!this.updateForm.dirty) {
      this.errorMessage = 'Data did no changing!';
    } else {
      this.errorMessage = 'Please check your input.'
    }
  }
  // check whether data vailad or not(ruled by Validators).
  checkInputVailad(valueSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.updateForm.controls) {
      this.updateForm.controls[i].touched == true;
    }
    if (this.updateForm.status == 'VALID') {
      return valueSubmit;
    } else {
      this.loadingGifFlag = false;
      return null;
    }
  }
  /*
    after data is ready to submit
  */
  stringifySubmitStr() {
    // To judge file fomat is image type, or not
    let filePath = this.receiptFile.name;
    let index = filePath.lastIndexOf(".");
    let ext = filePath.substr(index + 1);
    if (this.isAssetTypeAnImage(ext)) {
      let formData = new FormData();
      formData.append('productIdstr', this.updateForm.get('ProductId').value);
      formData.append('orgIdstr', this.updateForm.get('OrgId').value);
      formData.append('quantitystr', JSON.stringify(this.updateForm.get('Quantity').value));
      formData.append('pricestr', JSON.stringify(this.updateForm.get('BuyingPrice').value));
      formData.append('staffIdstr', this.updateForm.get('StaffId').value);
      formData.append('Receipt', this.receiptFile);
      this.submitByMode(formData);
    } else {
      Swal.fire({
        title: 'Format of the uploaded file is only png, jpg or jpeg!',
        type: 'error',
        showConfirmButton: true,
      });
      this.loadingGifFlag = false;
    }
  }
  // Add & Update new data 
  submitByMode(formValue) {
    //while push a stream of new data
    this.inventoriesService.addNew(formValue).subscribe(
      (res) => {
        Swal.fire({
          title: 'Success',
          type: 'success',
          text:'Successfully Add!',
          showConfirmButton: true,
        });
        this.activeModal.close();
      },
      (err) => {
        this.backendErrorHandler(err);
        console.log(err)
      }
    );
  }
  // Upload Receipt
  uploadReceipt(event) {
    //assign file to ReceiptToSubmit
    this.receiptFile = <File>event.target.files[0];
  }
  // limiting file formats is only image
  isAssetTypeAnImage(ext) {
    return ['png', 'jpg', 'jpeg'].indexOf(ext.toLowerCase()) !== -1;
  }
  // Show error message
  backendErrorHandler(err) {
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }

}
