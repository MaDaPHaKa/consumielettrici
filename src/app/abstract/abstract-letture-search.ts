import { LetturaDto } from '../dto/lettura-dto';
import { LetturaFilterDto } from '../dto/lettura-filter-dto';

function toDay(d: Date | string): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export abstract class AbstractLettureSearch {
  allData: LetturaDto[] = [];
  dataSource: LetturaDto[] = [];

  cerca(event: LetturaFilterDto) {
    if (!event.dal && !event.al && !event.elettrodomestico)
      this.dataSource = this.allData;
    else {
      this.filterData(event);
      this.afterFilter();
    }
  }

  filterData(filter: LetturaFilterDto) {
    this.dataSource = this.allData.filter((lettura) => {
      const elettrodomestico =
        !filter ||
        filter.elettrodomestico.length <= 0 ||
        lettura.elettrodomestici
          .map((elettr) => elettr.elettrodomestico.id)
          .filter((el) =>
            filter.elettrodomestico.map((el2) => el2.id).includes(el)
          ).length > 0;
      const dal =
        !filter || !filter.dal || toDay(lettura.giorno) >= toDay(filter.dal);
      const al =
        !filter || !filter.al || toDay(lettura.giorno) <= toDay(filter.al);
      return elettrodomestico && dal && al;
    });
  }

  abstract afterFilter(): void;
}
