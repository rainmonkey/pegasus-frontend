import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerModalComponent } from './messager-modal.component';

describe('MessagerModalComponent', () => {
  let component: MessagerModalComponent;
  let fixture: ComponentFixture<MessagerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
