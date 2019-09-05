import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcourseComponent } from './groupcourse.component';

describe('GroupcourseComponent', () => {
  let component: GroupcourseComponent;
  let fixture: ComponentFixture<GroupcourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupcourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
