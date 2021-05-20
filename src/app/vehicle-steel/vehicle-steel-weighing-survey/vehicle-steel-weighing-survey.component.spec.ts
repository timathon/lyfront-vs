import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelWeighingSurveyComponent } from './vehicle-steel-weighing-survey.component';

describe('VehicleSteelWeighingSurveyComponent', () => {
  let component: VehicleSteelWeighingSurveyComponent;
  let fixture: ComponentFixture<VehicleSteelWeighingSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelWeighingSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelWeighingSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
