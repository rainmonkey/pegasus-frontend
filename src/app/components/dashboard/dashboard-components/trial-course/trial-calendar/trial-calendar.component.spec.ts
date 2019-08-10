import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialCalendarComponent } from './trial-calendar.component';

describe('TrialCalendarComponent', () => {
  let component: TrialCalendarComponent;
  let fixture: ComponentFixture<TrialCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
