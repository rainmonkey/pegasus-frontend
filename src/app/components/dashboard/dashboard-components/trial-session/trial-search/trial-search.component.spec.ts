import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSearchComponent } from './trial-search.component';

describe('TrialSearchComponent', () => {
  let component: TrialSearchComponent;
  let fixture: ComponentFixture<TrialSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
