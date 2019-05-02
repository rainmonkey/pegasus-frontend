/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLearnerPaymentInvoiceComponent } from './admin-learner-payment-invoice.component';

describe('AdminLearnerPaymentInvoiceComponent', () => {
  let component: AdminLearnerPaymentInvoiceComponent;
  let fixture: ComponentFixture<AdminLearnerPaymentInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPaymentInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPaymentInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
