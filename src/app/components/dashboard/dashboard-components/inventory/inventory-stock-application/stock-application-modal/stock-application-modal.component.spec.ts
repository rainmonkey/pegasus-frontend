import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationModalComponent } from './stock-application-modal.component';

describe('StockApplicationModalComponent', () => {
  let component: StockApplicationModalComponent;
  let fixture: ComponentFixture<StockApplicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
