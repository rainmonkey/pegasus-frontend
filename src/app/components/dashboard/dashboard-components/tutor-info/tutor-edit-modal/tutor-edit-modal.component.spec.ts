import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorEditModalComponent } from './tutor-edit-modal.component';

describe('TutorEditModalComponent', () => {
  let component: TutorEditModalComponent;
  let fixture: ComponentFixture<TutorEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
