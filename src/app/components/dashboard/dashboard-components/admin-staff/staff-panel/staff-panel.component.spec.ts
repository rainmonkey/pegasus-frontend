/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StaffPanelComponent } from './staff-panel.component';

describe('StaffPanelComponent', () => {
  let component: StaffPanelComponent;
  let fixture: ComponentFixture<StaffPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
