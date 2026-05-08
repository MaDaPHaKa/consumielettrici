import Dexie, { Table } from 'dexie';
import { LetturaDto } from '../dto/lettura-dto';
import { LetturaElettrodomesticoDto } from '../dto/lettura-elettrodomestico-dto';

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

/**
 * Bulk join: letture + usoElettrodomestici + elettrodomestici in 1 IDB tx.
 * Builds in-memory maps to avoid N+1 query storm.
 */
export async function assembleLetturaDtos(): Promise<LetturaDto[]> {
  const [letture, usi, elettr] = await Promise.all([
    db.letture.toArray(),
    db.usoElettrodomestici.toArray(),
    db.elettrodomestici.toArray(),
  ]);
  const elMap = new Map<number, Elettrodomestico>();
  for (const e of elettr) {
    if (e.id != null) elMap.set(e.id, e);
  }
  const usiByDay = new Map<number, LetturaElettrodomesticoDto[]>();
  for (const u of usi) {
    const k = u.giorno.getTime();
    const dto = new LetturaElettrodomesticoDto();
    Object.assign(dto, u);
    const e = elMap.get(u.elettrodomesticoId);
    if (e) dto.elettrodomestico = e;
    const arr = usiByDay.get(k);
    if (arr) {
      arr.push(dto);
    } else {
      usiByDay.set(k, [dto]);
    }
  }
  return letture.map((l) => {
    const dto = new LetturaDto();
    Object.assign(dto, l);
    dto.elettrodomestici = usiByDay.get(l.giorno.getTime()) ?? [];
    return dto;
  });
}
