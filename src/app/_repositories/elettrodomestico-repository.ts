import { Elettrodomestico, Lettura, db } from '../_db/db';
import { BaseRepository } from './base-repository';

export class ElettrodomesticoRepository extends BaseRepository<Elettrodomestico> {
  constructor() {
    super(db.elettrodomestici);
  }
}
