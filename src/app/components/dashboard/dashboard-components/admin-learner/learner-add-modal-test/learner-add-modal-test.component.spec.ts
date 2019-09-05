import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerAddModalTestComponent } from './learner-add-modal-test.component';

describe('LearnerAddModalTestComponent', () => {
  let component: LearnerAddModalTestComponent;
  let fixture: ComponentFixture<LearnerAddModalTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerAddModalTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerAddModalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
