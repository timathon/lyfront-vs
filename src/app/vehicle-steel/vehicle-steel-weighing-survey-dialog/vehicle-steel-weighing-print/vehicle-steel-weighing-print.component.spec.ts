import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelWeighingPrintComponent } from './vehicle-steel-weighing-print.component';

describe('VehicleSteelWeighingPrintComponent', () => {
  let component: VehicleSteelWeighingPrintComponent;
  let fixture: ComponentFixture<VehicleSteelWeighingPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelWeighingPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelWeighingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
