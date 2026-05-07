import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { Observable, forkJoin, from, map, mergeMap, of, switchMap } from 'rxjs';
import { CambioAnno, Lettura } from '../_db/db';
import { LetturaRepository } from '../_repositories/lettura-repository';
import { LetturaDto } from '../dto/lettura-dto';
import { CambioAnnoService } from './cambio-anno.service';
import { UsoElettrodomesticoService } from './uso-elettrodomestico.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class LetturaService {
  constructor(
    public repository: LetturaRepository,
    private usoService: UsoElettrodomesticoService,
    private utils: UtilsService,
    private cambioAnnoService: CambioAnnoService
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
    lettura.giorno.setHours(0, 0, 0, 0);
    const prevDay = this.utils.getGiornoPrima(lettura.giorno);
    return this.cambioAnnoService.getForGiorno(lettura.giorno).pipe(
      switchMap((cambio) =>
        from(this.repository.table.where({ giorno: prevDay }).first()).pipe(
          switchMap((prevLett) => {
            lettura.consumo = this.calcolaConsumo(lettura, prevLett, cambio);
            return this.repository.save(lettura);
          })
        )
      )
    );
  }

  elimina(lettura: Lettura): Observable<void> {
    return this.repository.deleteByEntity(lettura);
  }

  ricalcolaConsumi(): Observable<number[]> {
    return from(this.repository.table.toArray()).pipe(
      switchMap((letture) => {
        if (letture.length === 0) return of([] as number[]);
        const saves$ = letture.map((lettura) => {
          const prevDay = this.utils.getGiornoPrima(lettura.giorno);
          const prevLett = letture.find(
            (el) => el.giorno.getTime() === prevDay.getTime()
          );
          return this.cambioAnnoService.getForGiorno(lettura.giorno).pipe(
            switchMap((cambio) => {
              lettura.consumo = this.calcolaConsumo(lettura, prevLett, cambio);
              return this.repository.save(lettura);
            })
          );
        });
        return forkJoin(saves$);
      })
    );
  }

  private calcolaConsumo(
    currLett: Lettura,
    prevLett: Lettura | undefined | null,
    cambio: CambioAnno
  ): number {
    let consumo = 0;
    if (prevLett) {
      const baseLineDate = cambio.dateBaseLine;
      const baseLineValue = cambio.lastBaseline;
      const currLet =
        currLett.giorno > baseLineDate
          ? currLett.lettura + baseLineValue
          : currLett.lettura;
      const prevLet =
        prevLett.giorno > baseLineDate
          ? prevLett.lettura + baseLineValue
          : prevLett.lettura;
      consumo = Number.parseFloat(
        ((currLet * 100 - prevLet * 100) / 100).toFixed(2)
      );
    }
    if (consumo < 0) return 0;
    return consumo;
  }
}
