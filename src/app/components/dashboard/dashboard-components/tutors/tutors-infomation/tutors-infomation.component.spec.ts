import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorsInfomationComponent } from './tutors-infomation.component';

describe('TutorsInfomationComponent', () => {
  let component: TutorsInfomationComponent;
  let fixture: ComponentFixture<TutorsInfomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorsInfomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorsInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
