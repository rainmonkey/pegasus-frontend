import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationProcessStatusComponent } from './stock-application-process-status.component';

describe('StockApplicationProcessStatusComponent', () => {
  let component: StockApplicationProcessStatusComponent;
  let fixture: ComponentFixture<StockApplicationProcessStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationProcessStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationProcessStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
