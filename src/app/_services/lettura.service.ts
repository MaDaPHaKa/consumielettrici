import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { Observable, forkJoin, from, map, mergeMap, switchMap } from 'rxjs';
import { Lettura } from '../_db/db';
import { LetturaRepository } from '../_repositories/lettura-repository';
import { LetturaDto } from '../dto/lettura-dto';
import { UsoElettrodomesticoService } from './uso-elettrodomestico.service';
import { UtilsService } from './utils.service';
import { CambioAnno } from '../dto/cambio-anno';

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
    return from(this.repository.table.where({ giorno: prevDay }).first()).pipe(
      switchMap((prevLett) => {
        lettura.consumo = this.calcolaConsumo(lettura, prevLett);
        return this.repository.save(lettura);
      })
    );
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

  private calcolaConsumo(
    currLett: Lettura,
    prevLett: Lettura | undefined | null
  ): number {
    let consumo = 0;
    if (prevLett) {
      const currCamb = this.getCambioAnno(currLett.giorno);
      console.log('curr: ', currLett);
      console.log('base: ', currCamb);
      const baseLineDate = currCamb.dateBaseLine;
      const baseLineValue = currCamb.lastBaseline;
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

  getCambioAnno(giorno: Date) {
    const firstBaseLine = new Date();
    firstBaseLine.setFullYear(2024);
    firstBaseLine.setDate(29);
    firstBaseLine.setMonth(1);
    firstBaseLine.setHours(0, 0, 0, 0);
    const baseLines = [
      new CambioAnno(1502.1, 2024, firstBaseLine),
      new CambioAnno(1317.368, 2025),
      new CambioAnno(1351.9300000000014, 2026), //FIXME mettere il valore corretto
    ];
    const currCamb = this.recuperaCambioAnno(
      baseLines,
      giorno.getTime()
    );
    return currCamb;
  }

  private recuperaCambioAnno(
    baseLines: CambioAnno[],
    current: number
  ): CambioAnno {
    let cambio: CambioAnno = baseLines[0];
    if (current <= cambio.dateBaseLine.getTime()) return cambio;
    baseLines.forEach((val) => {
      if (
        (current >= cambio.dateBaseLine.getTime() &&
          current < val.dateBaseLine.getTime()) ||
        current >= val.dateBaseLine.getTime()
      )
        cambio = val;
    });
    return cambio;
  }
}
