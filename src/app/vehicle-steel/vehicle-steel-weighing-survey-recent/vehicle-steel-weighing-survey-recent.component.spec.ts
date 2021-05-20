import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelWeighingSurveyRecentComponent } from './vehicle-steel-weighing-survey-recent.component';

describe('VehicleSteelWeighingSurveyRecentComponent', () => {
  let component: VehicleSteelWeighingSurveyRecentComponent;
  let fixture: ComponentFixture<VehicleSteelWeighingSurveyRecentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelWeighingSurveyRecentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelWeighingSurveyRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
