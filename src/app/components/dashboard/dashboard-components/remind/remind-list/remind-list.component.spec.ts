import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindListComponent } from './remind-list.component';

describe('RemindListComponent', () => {
  let component: RemindListComponent;
  let fixture: ComponentFixture<RemindListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
