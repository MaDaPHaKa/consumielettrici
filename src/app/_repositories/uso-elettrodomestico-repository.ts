import { Injectable } from '@angular/core';
import { UsoElettrodomestico, db } from '../_db/db';
import { BaseRepository } from './base-repository';

@Injectable({
  providedIn: 'root',
})
export class UsoElettrodomesticoRepository extends BaseRepository<UsoElettrodomestico> {
  constructor() {
    super(db.usoElettrodomestici);
  }
}
