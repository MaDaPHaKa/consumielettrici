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
        const seedDate2024 = new Date(2024, 1, 29, 0, 0, 0, 0);
        const seedDate2025 = new Date(2025, 0, 31, 0, 0, 0, 0);
        const seedDate2026 = new Date(2026, 0, 31, 0, 0, 0, 0);
        await tx.table('cambiAnno').bulkAdd([
          {
            anno: 2024,
            lastBaseline: 1502.1,
            dateBaseLine: seedDate2024,
            note: 'Seed migrazione v4',
          },
          {
            anno: 2025,
            lastBaseline: 1317.368,
            dateBaseLine: seedDate2025,
            note: 'Seed migrazione v4',
          },
          {
            anno: 2026,
            lastBaseline: 1351.9300000000014,
            dateBaseLine: seedDate2026,
            note: 'Seed migrazione v4 (verificare valore)',
          },
        ]);
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
    const seedDate2024 = new Date(2024, 1, 29, 0, 0, 0, 0);
    const seedDate2025 = new Date(2025, 0, 31, 0, 0, 0, 0);
    const seedDate2026 = new Date(2026, 0, 31, 0, 0, 0, 0);
    await db.cambiAnno.bulkAdd([
      {
        anno: 2024,
        lastBaseline: 1502.1,
        dateBaseLine: seedDate2024,
        note: 'Seed iniziale',
      },
      {
        anno: 2025,
        lastBaseline: 1317.368,
        dateBaseLine: seedDate2025,
        note: 'Seed iniziale',
      },
      {
        anno: 2026,
        lastBaseline: 1351.9300000000014,
        dateBaseLine: seedDate2026,
        note: 'Seed iniziale (verificare valore)',
      },
    ]);
  }
}

export const db = new AppDB();
