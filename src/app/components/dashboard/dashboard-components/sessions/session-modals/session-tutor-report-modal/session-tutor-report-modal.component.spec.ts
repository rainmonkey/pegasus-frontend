import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTutorReportModalComponent } from './session-tutor-report-modal.component';

describe('SessionTutorReportModalComponent', () => {
  let component: SessionTutorReportModalComponent;
  let fixture: ComponentFixture<SessionTutorReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTutorReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTutorReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
