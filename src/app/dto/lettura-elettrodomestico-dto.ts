import { Elettrodomestico } from '../_db/db';

export class LetturaElettrodomesticoDto {
  id: number = -1;
  giorno: Date = new Date();
  durata = 0;
  note = '';
  elettrodomestico: Elettrodomestico = { id: -1, nome: 'placeholder' };
}
