import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationPanelComponent } from './stock-application-panel.component';

describe('StockApplicationPanelComponent', () => {
  let component: StockApplicationPanelComponent;
  let fixture: ComponentFixture<StockApplicationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
