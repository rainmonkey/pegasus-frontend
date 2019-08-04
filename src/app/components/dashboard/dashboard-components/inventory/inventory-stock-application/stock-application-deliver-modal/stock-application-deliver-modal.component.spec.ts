import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationDeliverModalComponent } from './stock-application-deliver-modal.component';

describe('StockApplicationDeliverModalComponent', () => {
  let component: StockApplicationDeliverModalComponent;
  let fixture: ComponentFixture<StockApplicationDeliverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationDeliverModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationDeliverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
