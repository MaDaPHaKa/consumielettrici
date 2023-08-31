import { Injectable } from '@angular/core';
import { Observable, map, mergeAll, mergeMap, toArray } from 'rxjs';
import { ElettrodomesticoRepository } from '../_repositories/elettrodomestico-repository';
import { UsoElettrodomesticoRepository } from '../_repositories/uso-elettrodomestico-repository';
import { LetturaElettrodomesticoDto } from '../dto/lettura-elettrodomestico-dto';

@Injectable({
  providedIn: 'root',
})
export class UsoElettrodomesticoService {
  constructor(
    private repository: UsoElettrodomesticoRepository,
    private elettrodomesitcoRepository: ElettrodomesticoRepository
  ) {}

  getByGiorno(giorno: Date): Observable<LetturaElettrodomesticoDto[]> {
    return this.repository.getByGiorno(giorno).pipe(
      mergeAll(),
      mergeMap((uso) => {
        return this.elettrodomesitcoRepository.get(uso.elettrodomesticoId).pipe(
          map((el) => {
            const dto: LetturaElettrodomesticoDto =
              new LetturaElettrodomesticoDto();
            Object.assign(dto, uso);
            if (el) dto.elettrodomestico = el;
            return dto;
          })
        );
      }),
      toArray()
    );
  }
}
