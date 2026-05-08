import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { LetturaService } from '@services/lettura.service';
import { SnackbarService } from '@services/snackbar.service';
import { UtilsService } from '@services/utils.service';
import { AbstractLettureSearch } from  '@abstract/abstract-letture-search';
import { LetturaFilterDto } from  '@dto/lettura-filter-dto';
import { LettureFilterComponent } from '@components/letture-filter/letture-filter.component';
import { UsoElettrodomesticoComponent } from '@components/uso-elettrodomestico/uso-elettrodomestico.component';

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
}
