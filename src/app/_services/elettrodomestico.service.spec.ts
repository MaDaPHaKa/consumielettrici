import { TestBed } from '@angular/core/testing';

import { ElettrodomesticoService } from './elettrodomestico.service';

describe('ElettrodomesticoService', () => {
  let service: ElettrodomesticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElettrodomesticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
