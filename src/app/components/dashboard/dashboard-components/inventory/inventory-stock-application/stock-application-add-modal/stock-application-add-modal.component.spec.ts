import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationAddModalComponent } from './stock-application-add-modal.component';

describe('StockApplicationAddModalComponent', () => {
  let component: StockApplicationAddModalComponent;
  let fixture: ComponentFixture<StockApplicationAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
