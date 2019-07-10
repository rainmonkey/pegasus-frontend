/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LearnerItemComponent } from './learner-item.component';

describe('LearnerItemComponent', () => {
  let component: LearnerItemComponent;
  let fixture: ComponentFixture<LearnerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
