import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { CambioAnno, Lettura, db } from '../_db/db';
import { CambioAnnoRepository } from '../_repositories/cambio-anno-repository';

@Injectable({
  providedIn: 'root',
})
export class CambioAnnoService {
  constructor(public repository: CambioAnnoRepository) {}

  getAll(): Observable<CambioAnno[]> {
    return from(
      liveQuery(() =>
        this.repository.table.orderBy('dateBaseLine').toArray()
      )
    );
  }

  salva(cambio: CambioAnno): Observable<number> {
    cambio.dateBaseLine.setHours(0, 0, 0, 0);
    return this.repository.save(cambio);
  }

  elimina(cambio: CambioAnno): Observable<void> {
    return this.repository.deleteByEntity(cambio);
  }

  /**
   * Recupera il CambioAnno applicabile per il giorno indicato.
   * Logica equivalente alla vecchia recuperaCambioAnno: prende il
   * baseline con dateBaseLine <= giorno (il piu' recente).
   * Se nessuno presente ritorna baseline neutro (lastBaseline=0, data=epoch).
   */
  getForGiorno(giorno: Date): Observable<CambioAnno> {
    return from(
      this.repository.table.orderBy('dateBaseLine').toArray()
    ).pipe(map((all) => this.recupera(all, giorno.getTime())));
  }

  private recupera(baseLines: CambioAnno[], current: number): CambioAnno {
    if (baseLines.length === 0) {
      return {
        anno: 0,
        lastBaseline: 0,
        dateBaseLine: new Date(0),
      };
    }
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

  /**
   * Calcola il lastBaseline suggerito per un nuovo anno bolletta:
   * baseline precedente + ultima lettura registrata <= dateBaseLine.
   * Ritorna oggetto pronto per salva (id assente).
   */
  proponiNuovoAnno(anno: number, dateBaseLine: Date): Observable<CambioAnno> {
    dateBaseLine.setHours(0, 0, 0, 0);
    const all$ = from(this.repository.table.orderBy('dateBaseLine').toArray());
    const ultima$ = from(
      db.letture
        .where('giorno')
        .belowOrEqual(dateBaseLine)
        .reverse()
        .sortBy('giorno')
    );
    return forkJoin([all$, ultima$]).pipe(
      map(([all, ultima]) => {
        const prev = this.recupera(all, dateBaseLine.getTime());
        const ultimaLettura: Lettura | undefined = ultima[0];
        const proposed =
          (prev?.lastBaseline ?? 0) + (ultimaLettura?.lettura ?? 0);
        return {
          anno,
          lastBaseline: Number.parseFloat(proposed.toFixed(3)),
          dateBaseLine,
        };
      })
    );
  }
}
