import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ElettrodomesticoRepository } from '../_repositories/elettrodomestico-repository';
import { UsoElettrodomesticoRepository } from '../_repositories/uso-elettrodomestico-repository';
import { Elettrodomestico } from '../_db/db';

@Injectable({
  providedIn: 'root',
})
export class ElettrodomesticoService {
  constructor(
    private repository: ElettrodomesticoRepository,
    private usoRepo: UsoElettrodomesticoRepository
  ) {}

  canDelete(entity: Elettrodomestico): Observable<boolean> {
    return from(
      this.usoRepo.table.where({ elettrodomesticoId: entity.id }).count()
    ).pipe(map((count) => count <= 0));
  }
}
