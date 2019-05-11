import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCalendarViewTutorComponent } from './sessions-calendar-view-tutor.component';

describe('SessionsCalendarViewTutorComponent', () => {
  let component: SessionsCalendarViewTutorComponent;
  let fixture: ComponentFixture<SessionsCalendarViewTutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsCalendarViewTutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsCalendarViewTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
