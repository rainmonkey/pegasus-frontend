import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPanelComponent } from './courses-panel.component';

describe('CoursesPanelComponent', () => {
  let component: CoursesPanelComponent;
  let fixture: ComponentFixture<CoursesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
