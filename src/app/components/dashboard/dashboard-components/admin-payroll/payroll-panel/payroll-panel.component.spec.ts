import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPanelComponent } from './payroll-panel.component';

describe('PayrollPanelComponent', () => {
  let component: PayrollPanelComponent;
  let fixture: ComponentFixture<PayrollPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
