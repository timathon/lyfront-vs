import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelSurveyPrintComponent } from './vehicle-steel-survey-print.component';

describe('VehicleSteelSurveyPrintComponent', () => {
  let component: VehicleSteelSurveyPrintComponent;
  let fixture: ComponentFixture<VehicleSteelSurveyPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelSurveyPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelSurveyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
