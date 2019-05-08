import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCalendarViewComponent } from './sessions-calendar-view.component';

describe('SessionsCalendarViewComponent', () => {
  let component: SessionsCalendarViewComponent;
  let fixture: ComponentFixture<SessionsCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
