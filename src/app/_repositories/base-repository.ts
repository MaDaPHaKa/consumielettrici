import { Observable, Table, liveQuery } from 'dexie';
import { Identifiable } from '../_db/db';

export abstract class BaseRepository<T extends Identifiable> {
  table: Table<T, number>;

  constructor(table: Table<T, number>) {
    this.table = table;
  }

  getAll(): Observable<T[]> {
    return liveQuery(() => this.table.toArray());
  }

  save(lettura: T) {
    if (lettura.id) {
      this.table.update(lettura.id, lettura);
    } else {
      this.table.add(lettura);
    }
  }
}
