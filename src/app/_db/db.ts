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
  consumoTotale: number;
  giorno: Date;
  escludiDaMedia: boolean;
  escludiDaMinMax: boolean;
}

export interface CambioAnno extends Identifiable {
  anno: number;
  lastBaseline: number;
  dateBaseLine: Date;
  note?: string;
}

export const SEED_CAMBI_ANNO: CambioAnno[] = [
  {
    anno: 2024,
    lastBaseline: 1502.1,
    dateBaseLine: new Date(2024, 1, 29, 0, 0, 0, 0),
    note: 'Seed iniziale',
  },
  {
    anno: 2025,
    lastBaseline: 1317.368,
    dateBaseLine: new Date(2025, 0, 31, 0, 0, 0, 0),
    note: 'Seed iniziale',
  },
  {
    anno: 2026,
    lastBaseline: 1351.9300000000014,
    dateBaseLine: new Date(2026, 0, 31, 0, 0, 0, 0),
    note: 'Seed iniziale (verificare valore)',
  },
];

export class AppDB extends Dexie {
  elettrodomestici!: Table<Elettrodomestico, number>;
  usoElettrodomestici!: Table<UsoElettrodomestico, number>;
  letture!: Table<Lettura, number>;
  cambiAnno!: Table<CambioAnno, number>;

  constructor() {
    super('consumielettrici');
    this.version(3).stores({
      elettrodomestici: '++id, &nome',
      usoElettrodomestici:
        '++id, elettrodomesticoId, giorno, &[elettrodomesticoId+giorno]',
      letture: '++id, lettura, &giorno',
    });
    this.version(4)
      .stores({
        elettrodomestici: '++id, &nome',
        usoElettrodomestici:
          '++id, elettrodomesticoId, giorno, &[elettrodomesticoId+giorno]',
        letture: '++id, lettura, &giorno',
        cambiAnno: '++id, &anno, dateBaseLine',
      })
      .upgrade(async (tx) => {
        await tx
          .table('cambiAnno')
          .bulkAdd(SEED_CAMBI_ANNO.map((c) => ({ ...c, note: 'Seed migrazione v4' })));
      });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.elettrodomestici.bulkAdd([
      { nome: 'PC' },
      { nome: 'Lavastoviglie' },
      { nome: 'Aspirapolvere' },
      { nome: 'Lavatrice' },
    ]);
    await db.cambiAnno.bulkAdd(SEED_CAMBI_ANNO);
  }
}

export const db = new AppDB();
