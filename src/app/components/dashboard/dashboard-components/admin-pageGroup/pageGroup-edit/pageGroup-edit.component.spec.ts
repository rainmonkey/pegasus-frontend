/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageGroupEditComponent } from './pageGroup-edit.component';

describe('PageGroupEditComponent', () => {
  let component: PageGroupEditComponent;
  let fixture: ComponentFixture<PageGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
