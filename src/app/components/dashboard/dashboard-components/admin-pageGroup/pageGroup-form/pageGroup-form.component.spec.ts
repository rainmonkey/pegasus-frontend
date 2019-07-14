/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageGroupFormComponent } from './pageGroup-form.component';

describe('PageGroupFormComponent', () => {
  let component: PageGroupFormComponent;
  let fixture: ComponentFixture<PageGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
