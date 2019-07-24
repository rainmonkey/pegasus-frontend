import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationFormComponent } from './stock-application-form.component';

describe('StockApplicationFormComponent', () => {
  let component: StockApplicationFormComponent;
  let fixture: ComponentFixture<StockApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
