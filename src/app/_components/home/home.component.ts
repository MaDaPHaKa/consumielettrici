import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { LetturaDto } from 'src/app/dto/lettura-dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  dataSource: LetturaDto[] = [];
  displayedColumns = ['data', 'giorno', 'consumo', 'elettrodomestici'];
  media: number = -1;
  min: number = -1;
  max: number = -1;
  constructor(
    private service: LetturaService,
    public dialog: MatDialog,
    private utils: UtilsService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.faiCalcoli();
      },
      error: (err) => {
        console.log('Errore load letture', err);
        this.snackBar.error('Errore caricamento dati: ' + err);
      },
      complete: () => {},
    });
  }

  faiCalcoli() {
    this.dataSource.sort((a, b) => b.giorno.getTime() - a.giorno.getTime());
    if (this.dataSource.length > 0) {
      let copy = this.dataSource.slice();
      copy = copy
        .filter((el) => !el.escludiDaMedia)
        .sort((a, b) => a.consumo - b.consumo);
      copy = copy.filter((el) => el.consumo > 0);
      this.max = copy[copy.length - 1].consumo;
      this.min = copy[0].consumo;
      this.media =
        copy
          .filter((el) => !el.escludiDaMedia)
          .reduce((partialSum, a) => partialSum + a.consumo, 0) / copy.length;
    }
  }

  giornoSettimana(d: Date) {
    if (d instanceof Date) return this.utils.giornoSettimana(d);
    return '';
  }
}
