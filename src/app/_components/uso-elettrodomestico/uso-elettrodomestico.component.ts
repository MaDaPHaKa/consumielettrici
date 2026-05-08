import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, of } from 'rxjs';
import { UsoElettrodomesticoRepository } from  '@repositories/uso-elettrodomestico-repository';
import { SnackbarService } from  '@services/snackbar.service';
import { LetturaElettrodomesticoDto } from  '@dto/lettura-elettrodomestico-dto';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { LetturaElettrodomesticiComponent } from '@components/lettura-elettrodomestici/lettura-elettrodomestici.component';

@Component({
  selector: 'app-uso-elettrodomestico',
  templateUrl: './uso-elettrodomestico.component.html',
  styleUrls: ['./uso-elettrodomestico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class UsoElettrodomesticoComponent {
  private readonly usoEletRepo = inject(UsoElettrodomesticoRepository);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(SnackbarService);

  readonly uso = input<LetturaElettrodomesticoDto | undefined>(undefined);
  readonly nascondiPulsanti = input(false);
  readonly modified = output<void>();

  getNote(): string {
    const u = this.uso();
    if (u?.note && u.note.length > 0) return ' ' + u.note;
    return '';
  }

  getDurata(): string {
    const u = this.uso();
    let durata = '';
    if (u?.ore) durata += u.ore + 'h';
    if (u?.minuti) durata += (durata.length > 0 ? ' ' : '') + u.minuti + 'm';
    if (durata.length > 0) durata = ' (' + durata + ')';
    return durata;
  }

  modifica() {
    const u = this.uso();
    if (u) {
      const dialogRef = this.dialog.open(LetturaElettrodomesticiComponent, {
        data: { uso: u },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.usoEletRepo.save(result).subscribe({
            next: () => {
              this.snackBar.success('Uso modificato');
              this.modified.emit();
            },
            error: (err) => {
              this.snackBar.error('Errore modifica uso: ' + err);
            },
          });
        }
      });
    }
  }

  clona() {
    const u = this.uso();
    if (u) {
      const cloned: LetturaElettrodomesticoDto = {
        ...u,
        id: -1,
        giorno: undefined as unknown as Date,
      };
      const dialogRef = this.dialog.open(LetturaElettrodomesticiComponent, {
        data: { uso: cloned, clone: true },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (Array.isArray(result)) {
            const saves$ = result.map((el) =>
              this.usoEletRepo.save(el).pipe(
                catchError((err) => {
                  this.snackBar.error('Errore clonazione uso: ' + err);
                  return of(undefined);
                })
              )
            );
            forkJoin(saves$).subscribe({
              complete: () => {
                this.snackBar.success('Uso clonato');
                this.modified.emit();
              },
            });
          } else {
            this.usoEletRepo.save(result).subscribe({
              next: () => {
                this.snackBar.success('Uso clonato');
                this.modified.emit();
              },
              error: (err) => {
                this.snackBar.error('Errore clonazione uso: ' + err);
              },
            });
          }
        }
      });
    }
  }

  elimina() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Eliminare uso elettrodomestico?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const u = this.uso();
      if (result && u) {
        this.usoEletRepo.deleteById(u.id).subscribe({
          next: () => {
            this.modified.emit();
          },
        });
      }
    });
  }
}
