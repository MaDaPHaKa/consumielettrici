import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { Lettura } from '../_db/db';
import { LetturaRepository } from '../_repositories/lettura-repository';
import { LetturaDto } from '../dto/lettura-dto';
import { UsoElettrodomesticoService } from './uso-elettrodomestico.service';
import { liveQuery } from 'dexie';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class LetturaService {
  constructor(
    public repository: LetturaRepository,
    private usoService: UsoElettrodomesticoService,
    private utils: UtilsService
  ) { }

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
    lettura.giorno.setHours(0, 0, 0, 0);
    const prevDay = this.utils.getGiornoPrima(lettura.giorno);
    return from(this.repository.table
      .where({ giorno: prevDay })
      .first()).pipe(switchMap(prevLett => {
        lettura.consumo = this.calcolaConsumo(lettura, prevLett);
        return this.repository.save(lettura);
      }));

  }

  elimina(lettura: Lettura): Observable<void> {
    return this.repository.deleteByEntity(lettura);
  }

  async ricalcolaConsumi(): Promise<Observable<number>[]> {
    const letture = await this.repository.table.toArray();
    return letture.map((lettura) => {
      const prevDay = this.utils.getGiornoPrima(lettura.giorno);
      const prevLett = letture.find(
        (el) => el.giorno.getTime() === prevDay.getTime()
      );
      lettura.consumo = this.calcolaConsumo(lettura, prevLett);
      return this.salva(lettura);
    });
  }

  private calcolaConsumo(currLett: Lettura, prevLett: Lettura | undefined | null): number {
    let consumo = 0;
    if (prevLett) {
      const lastBaseline = 1502.1;
      // lettura.giorno.setHours(0, 0, 0, 0);
      const dateBaseLine = new Date();
      dateBaseLine.setHours(0, 0, 0, 0);
      dateBaseLine.setMonth(1);
      dateBaseLine.setDate(2);
      dateBaseLine.setFullYear(2024);
      const currLet = currLett.giorno > dateBaseLine ? currLett.lettura + lastBaseline : currLett.lettura;
      const prevLet = prevLett.giorno > dateBaseLine ? prevLett.lettura + lastBaseline : prevLett.lettura;
      consumo = Number.parseFloat(((currLet * 100 - prevLet * 100) / 100).toFixed(2));
    }
    if (consumo < 0) return 0;
    return consumo;
  }
}
