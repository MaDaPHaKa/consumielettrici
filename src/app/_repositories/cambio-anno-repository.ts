import { Injectable } from '@angular/core';
import { CambioAnno, db } from '../_db/db';
import { BaseRepository } from './base-repository';

@Injectable({
  providedIn: 'root',
})
export class CambioAnnoRepository extends BaseRepository<CambioAnno> {
  constructor() {
    super(db.cambiAnno);
  }
}
