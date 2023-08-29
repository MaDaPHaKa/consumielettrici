import { TestBed } from '@angular/core/testing';

import { LetturaService } from './lettura.service';

describe('LetturaService', () => {
  let service: LetturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
