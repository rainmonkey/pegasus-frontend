/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLearnerPaymentOtherComponent } from './admin-learner-payment-other.component';

describe('AdminLearnerPaymentOtherComponent', () => {
  let component: AdminLearnerPaymentOtherComponent;
  let fixture: ComponentFixture<AdminLearnerPaymentOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPaymentOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPaymentOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
