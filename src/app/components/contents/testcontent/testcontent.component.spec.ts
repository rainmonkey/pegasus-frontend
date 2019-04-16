import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcontentComponent } from './testcontent.component';

describe('TestcontentComponent', () => {
  let component: TestcontentComponent;
  let fixture: ComponentFixture<TestcontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
