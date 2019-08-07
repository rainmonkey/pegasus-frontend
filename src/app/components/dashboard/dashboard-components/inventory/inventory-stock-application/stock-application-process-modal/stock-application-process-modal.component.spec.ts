import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationProcessModalComponent } from './stock-application-process-modal.component';

describe('StockApplicationProcessModalComponent', () => {
  let component: StockApplicationProcessModalComponent;
  let fixture: ComponentFixture<StockApplicationProcessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationProcessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
