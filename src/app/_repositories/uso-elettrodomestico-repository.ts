import { UsoElettrodomestico, db } from '../_db/db';
import { BaseRepository } from './base-repository';

export class UsoElettrodomesticoRepository extends BaseRepository<UsoElettrodomestico> {
  constructor() {
    super(db.usoElettrodomestici);
  }
}
