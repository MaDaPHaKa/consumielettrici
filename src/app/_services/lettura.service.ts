import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, map, mergeMap } from 'rxjs';
import { Lettura } from '../_db/db';
import { LetturaRepository } from '../_repositories/lettura-repository';
import { LetturaDto } from '../dto/lettura-dto';
import { UsoElettrodomesticoService } from './uso-elettrodomestico.service';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class LetturaService {
  constructor(
    public repository: LetturaRepository,
    private usoService: UsoElettrodomesticoService
  ) {}

  getTableValues(): Observable<LetturaDto[]> {
    return this.repository.getAll().pipe(
      mergeMap((letture) =>
        forkJoin(
          letture.map((lettura) =>
            this.usoService.getByGiorno(lettura.giorno).pipe(
              map((usiDto) => {
                const dto = new LetturaDto();
                Object.assign(dto, lettura);
                dto.elettrodomestici = usiDto;
                return dto;
              })
            )
          )
        )
      )
    );
  }

  getLetturePerChart(
    dal: Date | undefined,
    al: Date | undefined
  ): Observable<Lettura[]> {
    if (dal && al) {
      return from(
        liveQuery(() =>
          this.repository.table
            .where('giorno')
            .between(dal, al, true, true)
            .toArray()
        )
      );
    } else if (al) {
      return from(
        liveQuery(() =>
          this.repository.table.where('giorno').belowOrEqual(al).toArray()
        )
      );
    } else if (dal) {
      return from(
        liveQuery(() =>
          this.repository.table.where('giorno').aboveOrEqual(dal).toArray()
        )
      );
    } else {
      return this.repository.getAll();
    }
  }

  salva(lettura: Lettura): Observable<number> {
    return this.repository.save(lettura);
  }

  elimina(lettura: Lettura): Observable<void> {
    return this.repository.deleteByEntity(lettura);
  }
}
