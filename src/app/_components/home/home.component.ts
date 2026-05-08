import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { LetturaService } from '@services/lettura.service';
import { SnackbarService } from '@services/snackbar.service';
import { AbstractLettureSearch } from  '@abstract/abstract-letture-search';
import { LetturaFilterDto } from  '@dto/lettura-filter-dto';
import { LettureFilterComponent } from '@components/letture-filter/letture-filter.component';
import { UsoElettrodomesticoComponent } from '@components/uso-elettrodomestico/uso-elettrodomestico.component';
import { GiornoSettimanaPipe } from '@pipes/giorno-settimana.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    LettureFilterComponent,
    UsoElettrodomesticoComponent,
    GiornoSettimanaPipe,
  ],
})
export class HomeComponent extends AbstractLettureSearch implements OnInit {
  private readonly service = inject(LetturaService);
  private readonly snackBar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns = ['data', 'giorno', 'consumo', 'elettrodomestici'];
  somma: number = -1;
  media: number = -1;
  min: number = -1;
  max: number = -1;

  ngOnInit(): void {
    this.service
      .getTableValues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.allData = data;
          this.cerca(new LetturaFilterDto());
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.snackBar.error('Errore caricamento dati: ' + err);
        },
      });
  }

  afterFilter(): void {
    this.dataSource.sort((a, b) => b.giorno.getTime() - a.giorno.getTime());
    if (this.dataSource.length === 0) return;

    let somma = 0;
    let countMedia = 0;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const el of this.dataSource) {
      if (!el.escludiDaMedia) {
        somma += el.consumo;
        countMedia++;
      }
      if (!el.escludiDaMinMax && el.consumo > 0) {
        if (el.consumo < min) min = el.consumo;
        if (el.consumo > max) max = el.consumo;
      }
    }

    this.somma = somma;
    this.media = countMedia > 0 ? somma / countMedia : 0;
    this.min = min === Number.POSITIVE_INFINITY ? 0 : min;
    this.max = max === Number.NEGATIVE_INFINITY ? 0 : max;
  }
}
