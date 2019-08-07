import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationDisputeModalComponent } from './stock-application-dispute-modal.component';

describe('StockApplicationDisputeModalComponent', () => {
  let component: StockApplicationDisputeModalComponent;
  let fixture: ComponentFixture<StockApplicationDisputeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationDisputeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationDisputeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
