import { TestBed } from '@angular/core/testing';

import { CustomerDialogServiceService } from './customer-dialog-service.service';

describe('CustomerDialogServiceService', () => {
  let service: CustomerDialogServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDialogServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
