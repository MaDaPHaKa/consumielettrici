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

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  form: FormGroup = new FormGroup([]);
  data: any[] = [];
  view: [number, number] = [700, 400];
  options = new ChartOptions();

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
    this.search();
  }

  initForm() {
    const oggi = moment(moment.now()).startOf('day');
    const unMeseFa = moment(moment.now()).subtract(1, 'months').startOf('day');

    this.form = this.builder.group({
      dal: new FormControl(unMeseFa.toDate()),
      al: new FormControl(oggi.toDate()),
    });
  }

  search() {
    const dal = this.form.get('dal')?.value;
    const al = this.form.get('al')?.value;
    this.lettureService.getLetturePerChart(dal, al).subscribe({
      next: (data) => {
        this.data = data.map((el) => {
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
