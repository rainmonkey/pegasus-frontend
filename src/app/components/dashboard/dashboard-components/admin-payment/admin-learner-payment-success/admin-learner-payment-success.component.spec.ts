/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLearnerPaymentSuccessComponent } from './admin-learner-payment-success.component';

describe('AdminLearnerPaymentSuccessComponent', () => {
  let component: AdminLearnerPaymentSuccessComponent;
  let fixture: ComponentFixture<AdminLearnerPaymentSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPaymentSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
