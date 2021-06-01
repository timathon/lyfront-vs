import { TestBed } from '@angular/core/testing';

import { CalculatePatchesService } from './calculate-patches.service';

describe('CalculatePatchesService', () => {
  let service: CalculatePatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatePatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
