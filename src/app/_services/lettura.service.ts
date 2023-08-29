import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, mergeMap } from 'rxjs';
import { ElettrodomesticoRepository } from '../_repositories/elettrodomestico-repository';
import { LetturaRepository } from '../_repositories/lettura-repository';
import { UsoElettrodomesticoRepository } from '../_repositories/uso-elettrodomestico-repository';
import { LetturaDto } from '../dto/lettura-dto';
import { LetturaElettrodomesticoDto } from '../dto/lettura-elettrodomestico-dto';
import { Lettura } from '../_db/db';

@Injectable({
  providedIn: 'root',
})
export class LetturaService {
  constructor(
    private repository: LetturaRepository,
    private elettrodomesitcoRepository: ElettrodomesticoRepository,
    private usoRepository: UsoElettrodomesticoRepository
  ) {}

  getTableValues(): Observable<LetturaDto[]> {
    return this.repository.getAll().pipe(
      map((letture) =>
        letture.map((lettura) => {
          const letturaDto = new LetturaDto();
          this.usoRepository.getByGiorno(lettura.giorno).pipe(
            map((usi) =>
              usi.map((uso) => {
                const letturaElettrodomesticoDto =
                  new LetturaElettrodomesticoDto();
                this.elettrodomesitcoRepository
                  .get(uso.elettrodomesticoId)
                  .pipe(
                    map((elettrodomestico) => {
                      if (elettrodomestico) {
                        letturaElettrodomesticoDto.elettrodomestico =
                          elettrodomestico;
                      }
                    })
                  );
                letturaDto.elettrodomestici.push(letturaElettrodomesticoDto);
                return letturaElettrodomesticoDto;
              })
            )
          );
          return letturaDto;
        })
      )
    );
  }

  salva(lettura: Lettura): Observable<number> {
    return this.repository.save(lettura);
  }
}
