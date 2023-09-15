import { Elettrodomestico } from '../_db/db';

export class LetturaFilterDto {
  dal: Date | undefined;
  al: Date | undefined;
  elettrodomestico: Elettrodomestico[] = [];
}
