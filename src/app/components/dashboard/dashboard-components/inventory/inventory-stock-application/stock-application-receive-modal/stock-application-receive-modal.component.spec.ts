import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationReceiveModalComponent } from './stock-application-receive-modal.component';

describe('StockApplicationReceiveModalComponent', () => {
  let component: StockApplicationReceiveModalComponent;
  let fixture: ComponentFixture<StockApplicationReceiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationReceiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationReceiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
