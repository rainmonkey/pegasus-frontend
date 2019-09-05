import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookcourseComponent } from './bookcourse.component';

describe('BookcourseComponent', () => {
  let component: BookcourseComponent;
  let fixture: ComponentFixture<BookcourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookcourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
