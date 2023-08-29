import { Lettura, db } from '../_db/db';
import { BaseRepository } from './base-repository';

export class LetturaRepository extends BaseRepository<Lettura> {
  constructor() {
    super(db.letture);
  }
}
