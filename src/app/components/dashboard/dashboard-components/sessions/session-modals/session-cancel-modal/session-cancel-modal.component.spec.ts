import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCancelModalComponent } from './session-cancel-modal.component';

describe('SessionCancelModalComponent', () => {
  let component: SessionCancelModalComponent;
  let fixture: ComponentFixture<SessionCancelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionCancelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCancelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
