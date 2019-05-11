import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearnerPanelComponent } from './admin-learner-panel.component';

describe('AdminLearnerPanelComponent', () => {
  let component: AdminLearnerPanelComponent;
  let fixture: ComponentFixture<AdminLearnerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
