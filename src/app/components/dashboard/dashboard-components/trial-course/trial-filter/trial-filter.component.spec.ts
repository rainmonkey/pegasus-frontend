import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialFilterComponent } from './trial-filter.component';

describe('TrialFilterComponent', () => {
  let component: TrialFilterComponent;
  let fixture: ComponentFixture<TrialFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
