import Dexie, { Table } from 'dexie';

export interface Identifiable {
  id?: number;
}

export interface Elettrodomestico extends Identifiable {
  nome: string;
}

export interface UsoElettrodomestico extends Identifiable {
  elettrodomesticoId: number;
  note: string;
  ore: number;
  minuti: number;
  giorno: Date;
}

export interface Lettura extends Identifiable {
  lettura: number;
  consumo: number;
  giorno: Date;
  escludiDaMedia: boolean;
}

export class AppDB extends Dexie {
  elettrodomestici!: Table<Elettrodomestico, number>;
  usoElettrodomestici!: Table<UsoElettrodomestico, number>;
  letture!: Table<Lettura, number>;

  constructor() {
    super('consumielettrici');
    this.version(3).stores({
      elettrodomestici: '++id, &nome',
      usoElettrodomestici:
        '++id, elettrodomesticoId, giorno, &[elettrodomesticoId+giorno]',
      letture: '++id, lettura, &giorno',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    const elettrodomestici = await db.elettrodomestici.bulkAdd([
      {
        nome: 'PC',
      },
      {
        nome: 'Lavastoviglie',
      },
      {
        nome: 'Aspirapolvere',
      },
      {
        nome: 'Lavatrice',
      },
    ]);
  }
}

export const db = new AppDB();
