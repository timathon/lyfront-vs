import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSteelWeighingSurveyDialogComponent } from './vehicle-steel-weighing-survey-dialog.component';

describe('VehicleSteelWeighingSurveyDialogComponent', () => {
  let component: VehicleSteelWeighingSurveyDialogComponent;
  let fixture: ComponentFixture<VehicleSteelWeighingSurveyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSteelWeighingSurveyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSteelWeighingSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
