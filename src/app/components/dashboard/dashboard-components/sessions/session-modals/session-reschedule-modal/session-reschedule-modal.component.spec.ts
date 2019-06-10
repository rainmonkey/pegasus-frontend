import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRescheduleModalComponent } from './session-reschedule-modal.component';

describe('SessionRescheduleModalComponent', () => {
  let component: SessionRescheduleModalComponent;
  let fixture: ComponentFixture<SessionRescheduleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionRescheduleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionRescheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
