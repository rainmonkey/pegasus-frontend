import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookcoursetestComponent } from './bookcoursetest.component';

describe('BookcoursetestComponent', () => {
  let component: BookcoursetestComponent;
  let fixture: ComponentFixture<BookcoursetestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookcoursetestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookcoursetestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
