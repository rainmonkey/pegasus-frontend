import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCompletedModalComponent } from './session-completed-modal.component';

describe('SessionCompletedModalComponent', () => {
  let component: SessionCompletedModalComponent;
  let fixture: ComponentFixture<SessionCompletedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionCompletedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCompletedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
