import { Injectable } from '@angular/core';
import { Elettrodomestico, db } from '../_db/db';
import { BaseRepository } from './base-repository';

@Injectable({
  providedIn: 'root',
})
export class ElettrodomesticoRepository extends BaseRepository<Elettrodomestico> {
  constructor() {
    super(db.elettrodomestici);
  }

}
