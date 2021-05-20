import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelHomeComponent } from './vehicle-steel-home.component';

describe('VehicleSteelHomeComponent', () => {
  let component: VehicleSteelHomeComponent;
  let fixture: ComponentFixture<VehicleSteelHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
