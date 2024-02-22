import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { ChartOptions } from 'src/app/dto/chart-options';
import { LetturaFilterDto } from 'src/app/dto/lettura-filter-dto';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  data: any[] = [];
  view: [number, number] = [700, 400];
  options = new ChartOptions();
  dal: Date | undefined;
  al: Date | undefined;

  constructor(
    private lettureService: LetturaService,
    private builder: FormBuilder,
    private snackBar: SnackbarService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.options.xAxisLabel = 'Giorno';
    this.options.yAxisLabel = 'Consumo';
    const filter = new LetturaFilterDto();
    filter.dal = this.dal;
    filter.al = this.al;
    this.cerca(filter);
  }

  initForm() {
    const oggi = moment(moment.now()).startOf('day');
    const unMeseFa = moment(moment.now()).subtract(1, 'months').startOf('day');
    this.dal = unMeseFa.toDate();
    this.al = oggi.toDate();
  }

  cerca(filter: LetturaFilterDto) {
    this.lettureService.getLetturePerChart(filter.dal, filter.al).subscribe({
      next: (data) => {
        this.data = data
          .filter((el) => !el.escludiDaMinMax)
          .map((el) => {
            return {
              name: el.giorno,
              value: el.consumo ? el.consumo : 0,
            };
          });
      },
      error: (err) => {
        console.log('errore load chart: ', err);
        this.snackBar.error(err);
      },
      complete: () => {},
    });
  }
  onSelect(event: any) {}
}
