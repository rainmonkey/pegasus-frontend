import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailModalComponent } from './inventory-detail-modal.component';

describe('InventoryDetailModalComponent', () => {
  let component: InventoryDetailModalComponent;
  let fixture: ComponentFixture<InventoryDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
