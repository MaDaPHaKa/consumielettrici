export class CambioAnno {
  lastBaseline: number;
  dateBaseLine: Date;

  constructor(
    lastBaseline: number,
    year: number,
    data: Date | undefined = undefined
  ) {
    this.lastBaseline = lastBaseline;
    if (data !== undefined) {
      this.dateBaseLine = data;
    } else {
      this.dateBaseLine = new Date();
      this.dateBaseLine.setFullYear(year);
      this.dateBaseLine.setMonth(0);
      this.dateBaseLine.setDate(31);
      this.dateBaseLine.setHours(0, 0, 0, 0);
      console.log('datedemmerda:',this.dateBaseLine)
    }
  }
}
