import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRecieptModalComponent } from './inventory-reciept-modal.component';

describe('InventoryRecieptModalComponent', () => {
  let component: InventoryRecieptModalComponent;
  let fixture: ComponentFixture<InventoryRecieptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRecieptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRecieptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
