import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerPersonalInfoComponent } from './messager-personal-info.component';

describe('MessagerPersonalInfoComponent', () => {
  let component: MessagerPersonalInfoComponent;
  let fixture: ComponentFixture<MessagerPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
