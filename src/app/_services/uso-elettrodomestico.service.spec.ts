import { TestBed } from '@angular/core/testing';

import { UsoElettrodomesticoService } from './uso-elettrodomestico.service';

describe('UsoElettrodomesticoService', () => {
  let service: UsoElettrodomesticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsoElettrodomesticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
