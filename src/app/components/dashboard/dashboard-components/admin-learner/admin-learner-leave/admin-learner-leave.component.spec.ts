import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearnerLeaveComponent } from './admin-learner-leave.component';

describe('AdminLearnerLeaveComponent', () => {
  let component: AdminLearnerLeaveComponent;
  let fixture: ComponentFixture<AdminLearnerLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
