import { Table, liveQuery } from 'dexie';
import { Observable, from, of } from 'rxjs';
import { Identifiable } from '../_db/db';

export abstract class BaseRepository<T extends Identifiable> {
  table: Table<T, number>;

  constructor(table: Table<T, number>) {
    this.table = table;
  }

  getAll(): Observable<T[]> {
    return from(liveQuery(() => this.table.toArray()));
  }

  get(id: number): Observable<T | undefined> {
    return from(this.table.get(id));
  }

  orderedByGiorno(): Observable<T[]> {
    return from(this.table.orderBy('giorno').toArray());
  }

  getByGiorno(giornoVal: Date): Observable<T[]> {
    return from(this.table.where('giorno').equals(giornoVal).toArray());
  }

  liveByGiorno(giornoVal: Date): Observable<T[]> {
    return from(liveQuery(() => this.table.where('giorno').equals(giornoVal).toArray()));
  }

  liveAll(): Observable<T[]> {
    return from(liveQuery(() => this.table.toArray()));
  }

  save(lettura: T): Observable<number> {
    if (lettura.id) {
      return from(this.table.put(lettura, lettura.id));
    } else {
      return from(this.table.add(lettura));
    }
  }

  bulkSave(items: T[]): Observable<unknown> {
    return from(this.table.bulkPut(items));
  }

  deleteByEntity(entity: T): Observable<void> {
    if (entity.id) return this.deleteById(entity.id);
    return of(undefined);
  }

  deleteById(id: number): Observable<void> {
    return from(this.table.delete(id));
  }
}
