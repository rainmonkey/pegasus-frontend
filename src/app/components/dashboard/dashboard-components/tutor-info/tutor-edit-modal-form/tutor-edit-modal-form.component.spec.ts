import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorEditModalFormComponent } from './tutor-edit-modal-form.component';

describe('TutorEditModalFormComponent', () => {
  let component: TutorEditModalFormComponent;
  let fixture: ComponentFixture<TutorEditModalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorEditModalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorEditModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
