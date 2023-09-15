import * as moment from 'moment';
import { LetturaDto } from '../dto/lettura-dto';
import { LetturaFilterDto } from '../dto/lettura-filter-dto';

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
        !filter ||
        !filter.dal ||
        moment(lettura.giorno).isSameOrAfter(moment(filter.dal));
      const al =
        !filter ||
        !filter.al ||
        moment(lettura.giorno).isSameOrBefore(moment(filter.al));
      return elettrodomestico && dal && al;
    });
  }

  abstract afterFilter(): void;
}
