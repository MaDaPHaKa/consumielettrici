import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Elettrodomestico } from  '@db/db';
import { ElettrodomesticoRepository } from  '@repositories/elettrodomestico-repository';
import { SnackbarService } from  '@services/snackbar.service';
import { LetturaFilterDto } from  '@dto/lettura-filter-dto';

@Component({
  selector: 'app-letture-filter',
  templateUrl: './letture-filter.component.html',
  styleUrls: ['./letture-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class LettureFilterComponent implements OnInit {
  private readonly elettrRepo = inject(ElettrodomesticoRepository);
  private readonly snackBar = inject(SnackbarService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly cercaEvent = output<LetturaFilterDto>();
  readonly dalInput = input<Date | undefined>(undefined, { alias: 'dal' });
  readonly alInput = input<Date | undefined>(undefined, { alias: 'al' });

  dal: Date | undefined;
  al: Date | undefined;
  elett: Elettrodomestico[] = [];
  elettrodomestico: Elettrodomestico[] = [];

  ngOnInit(): void {
    this.dal = this.dalInput();
    this.al = this.alInput();
    this.elettrRepo.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.elett = data.sort((a, b) => a.nome.localeCompare(b.nome));
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.snackBar.error('Errore caricamento elettrodomestici: ' + err);
      },
    });
  }

  cerca() {
    const filter = new LetturaFilterDto();
    filter.dal = this.dal;
    filter.al = this.al;
    filter.dal?.setHours(0, 0, 0, 0);
    filter.al?.setHours(0, 0, 0, 0);
    filter.elettrodomestico = this.elettrodomestico;
    this.cercaEvent.emit(filter);
  }
}
