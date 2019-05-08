/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLearnerPaymentSussessComponent } from './admin-learner-payment-sussess.component';

describe('AdminLearnerPaymentSussessComponent', () => {
  let component: AdminLearnerPaymentSussessComponent;
  let fixture: ComponentFixture<AdminLearnerPaymentSussessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPaymentSussessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPaymentSussessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
