import { Injectable } from '@angular/core';
import { Lettura, db } from '../_db/db';
import { BaseRepository } from './base-repository';

@Injectable({
  providedIn: 'root',
})
export class LetturaRepository extends BaseRepository<Lettura> {
  constructor() {
    super(db.letture);
  }
}
