import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationDeleteModalComponent } from './stock-application-delete-modal.component';

describe('StockApplicationDeleteModalComponent', () => {
  let component: StockApplicationDeleteModalComponent;
  let fixture: ComponentFixture<StockApplicationDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
