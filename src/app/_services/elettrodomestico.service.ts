import { Injectable } from '@angular/core';
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

  async canDelete(entity: Elettrodomestico): Promise<boolean> {
    return (
      (await this.usoRepo.table
        .where({ elettrodomesticoId: entity.id })
        .count()) <= 0
    );
  }
}
