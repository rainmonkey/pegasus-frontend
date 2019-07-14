import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationDetailModalComponent } from './stock-application-detail-modal.component';

describe('StockApplicationDetailModalComponent', () => {
  let component: StockApplicationDetailModalComponent;
  let fixture: ComponentFixture<StockApplicationDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
