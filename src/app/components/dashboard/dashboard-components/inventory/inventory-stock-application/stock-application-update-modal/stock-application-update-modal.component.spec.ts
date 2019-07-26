import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationUpdateModalComponent } from './stock-application-update-modal.component';

describe('StockApplicationUpdateModalComponent', () => {
  let component: StockApplicationUpdateModalComponent;
  let fixture: ComponentFixture<StockApplicationUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
