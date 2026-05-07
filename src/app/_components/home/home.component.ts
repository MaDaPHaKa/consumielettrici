import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AbstractLettureSearch } from 'src/app/abstract/abstract-letture-search';
import { LetturaFilterDto } from 'src/app/dto/lettura-filter-dto';
import { LettureFilterComponent } from '../letture-filter/letture-filter.component';
import { NuovoAnnoDialogComponent } from '../nuovo-anno-dialog/nuovo-anno-dialog.component';
import { UsoElettrodomesticoComponent } from '../uso-elettrodomestico/uso-elettrodomestico.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    LettureFilterComponent,
    UsoElettrodomesticoComponent,
  ],
})
export class HomeComponent extends AbstractLettureSearch implements OnInit {
  private readonly service = inject(LetturaService);
  readonly dialog = inject(MatDialog);
  private readonly utils = inject(UtilsService);
  private readonly snackBar = inject(SnackbarService);

  displayedColumns = ['data', 'giorno', 'consumo', 'elettrodomestici'];
  somma: number = -1;
  media: number = -1;
  min: number = -1;
  max: number = -1;

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => {
        this.allData = data;
        this.cerca(new LetturaFilterDto());
      },
      error: (err) => {
        this.snackBar.error('Errore caricamento dati: ' + err);
      },
    });
  }

  afterFilter(): void {
    this.dataSource.sort((a, b) => b.giorno.getTime() - a.giorno.getTime());
    if (this.dataSource.length > 0) {
      const copy = this.dataSource.slice();
      const perMinMax = copy
        .filter((el) => !el.escludiDaMinMax && el.consumo > 0)
        .sort((a, b) => a.consumo - b.consumo);
      this.max = perMinMax[perMinMax.length - 1].consumo;
      this.min = perMinMax[0].consumo;
      const mediaList = copy.filter((el) => !el.escludiDaMedia);
      this.media =
        mediaList.reduce((partialSum, a) => partialSum + a.consumo, 0) /
        mediaList.length;
      this.somma = mediaList.reduce(
        (partialSum, a) => partialSum + a.consumo,
        0
      );
    }
  }

  giornoSettimana(d: Date) {
    if (d instanceof Date) return this.utils.giornoSettimana(d);
    return '';
  }

  nuovoAnno() {
    const ref = this.dialog.open(NuovoAnnoDialogComponent, {
      width: '420px',
    });
    ref.afterClosed().subscribe((res) => {
      if (res?.ricalcola) {
        this.service.ricalcolaConsumi().subscribe({
          next: (results) => {
            if (results.length === 0) return;
            this.snackBar.success('Consumi ricalcolati');
          },
          error: (err) =>
            this.snackBar.error('Errore ricalcolo consumi: ' + err),
        });
      }
    });
  }
}
