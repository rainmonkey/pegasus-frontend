import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerIconComponent } from './messager-icon.component';

describe('MessagerIconComponent', () => {
  let component: MessagerIconComponent;
  let fixture: ComponentFixture<MessagerIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
