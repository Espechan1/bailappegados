import { TestBed } from '@angular/core/testing';

import { PremisesService } from './premises.service';

describe('PremisesService', () => {
  let service: PremisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
