import { LetturaElettrodomesticoDto } from './lettura-elettrodomestico-dto';

export class LetturaDto {
  id: number = -1;
  giorno: Date = new Date();
  lettura: number = -1;
  elettrodomestici: LetturaElettrodomesticoDto[] = [];
  consumo = -1;
  consumoTotale = -1;
  escludiDaMedia = false;
  escludiDaMinMax = false;
}
