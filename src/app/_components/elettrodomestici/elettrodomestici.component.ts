import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { Elettrodomestico } from '@db/db';
import { ElettrodomesticoRepository } from '@repositories/elettrodomestico-repository';
import { ElettrodomesticoService } from '@services/elettrodomestico.service';
import { SnackbarService } from '@services/snackbar.service';
import { ElettrodomesticoTableDto } from  '@dto/elettrodomestico-table-dto';

@Component({
  selector: 'app-elettrodomestici',
  templateUrl: './elettrodomestici.component.html',
  styleUrls: ['./elettrodomestici.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
})
export class ElettrodomesticiComponent implements OnInit {
  private readonly repository = inject(ElettrodomesticoRepository);
  private readonly service = inject(ElettrodomesticoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(SnackbarService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  nuovo?: string;
  dataSource: ElettrodomesticoTableDto[] = [];
  displayedColumns = ['nome', 'azioni'];

  ngOnInit() {
    this.repository.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.dataSource = data.map((el) =>
          Object.assign(new ElettrodomesticoTableDto(), el)
        );
        this.dataSource.sort((a, b) => a.nome.localeCompare(b.nome));
        this.dataSource.forEach((el) =>
          this.service.canDelete(el).subscribe({
            next: (res) => {
              el.canDelete = res;
              this.cdr.markForCheck();
            },
            error: (err) => {
              this.snackBar.error('Errore check canDelete: ' + err);
            },
          })
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.snackBar.error('Errore caricamento elettrodomestici: ' + err);
      },
    });
  }

  aggiungi() {
    if (this.nuovo) {
      const elettr = { nome: this.nuovo } as ElettrodomesticoTableDto;
      this.salva(elettr);
    }
  }

  salva(el: ElettrodomesticoTableDto) {
    const { canDelete: _, ...entity } = el;
    this.repository.save(entity).subscribe({
      next: () => this.snackBar.success('Elettrodomestico salvato'),
      error: (err) => {
        this.snackBar.error('Errore salvataggio elettrodomestico: ' + err);
      },
    });
    this.nuovo = undefined;
  }

  elimina(toDelete: Elettrodomestico) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Elimino?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.repository.deleteByEntity(toDelete).subscribe({
          next: () => this.snackBar.success('Elettrodomestico eliminato'),
          error: (err) => {
            this.snackBar.error(
              'Errore cancellazione elettrodomestico: ' + err
            );
          },
        });
      }
    });
  }
}
