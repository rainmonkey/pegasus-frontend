import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindPanelComponent } from './remind-panel.component';

describe('RemindPanelComponent', () => {
  let component: RemindPanelComponent;
  let fixture: ComponentFixture<RemindPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
