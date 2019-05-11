import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDetailModalComponent } from './session-detail-modal.component';

describe('SessionDetailModalComponent', () => {
  let component: SessionDetailModalComponent;
  let fixture: ComponentFixture<SessionDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
