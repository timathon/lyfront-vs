import { TestBed } from '@angular/core/testing';

import { VehicleSteelWeighingSurveyDialogService } from './vehicle-steel-weighing-survey-dialog.service';

describe('VehicleSteelWeighingSurveyDialogService', () => {
  let service: VehicleSteelWeighingSurveyDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleSteelWeighingSurveyDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
