import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCalendarViewAdminComponent } from './sessions-calendar-view-admin.component';

describe('SessionsCalendarViewAdminComponent', () => {
  let component: SessionsCalendarViewAdminComponent;
  let fixture: ComponentFixture<SessionsCalendarViewAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsCalendarViewAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsCalendarViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
