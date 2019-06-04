/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LearnerRegistrationConfirmModalComponent } from './learner-registration-confirm-modal.component';

describe('LearnerRegistrationConfirmModalComponent', () => {
  let component: LearnerRegistrationConfirmModalComponent;
  let fixture: ComponentFixture<LearnerRegistrationConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerRegistrationConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerRegistrationConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
