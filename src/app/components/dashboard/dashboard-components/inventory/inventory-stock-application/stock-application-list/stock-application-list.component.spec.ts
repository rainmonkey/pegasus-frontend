import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationListComponent } from './stock-application-list.component';

describe('StockApplicationListComponent', () => {
  let component: StockApplicationListComponent;
  let fixture: ComponentFixture<StockApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
