import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearnerListComponent } from './admin-learner-list.component';

describe('AdminLearnerListComponent', () => {
  let component: AdminLearnerListComponent;
  let fixture: ComponentFixture<AdminLearnerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
