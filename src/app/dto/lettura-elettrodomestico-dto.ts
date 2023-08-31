import { Elettrodomestico } from '../_db/db';

export class LetturaElettrodomesticoDto {
  id: number = -1;
  giorno: Date = new Date();
  ore = 0;
  minuti = 0;
  note = '';
  elettrodomestico: Elettrodomestico = { id: -1, nome: 'placeholder' };
}
