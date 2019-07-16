import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock-application-detail-modal',
  templateUrl: './stock-application-detail-modal.component.html',
  styleUrls: ['./stock-application-detail-modal.component.css']
})
export class StockApplicationDetailModalComponent implements OnInit {
  // @Input() name;

  public applicationFrom: FormGroup;
  
  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.applicationFrom = this.fb.group(this.formGroupAssemble())
  }

  formGroupAssemble() {
    return {
      staffName: ['', Validators.required],
      location: ['', Validators.required],
      applyAt: ['', Validators.required],
      applyReason: ['', Validators.required],
      productName: ['', Validators.required],
      productQty: ['', Validators.required]
    }
  }

}
