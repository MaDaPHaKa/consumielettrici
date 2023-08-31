import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsoElettrodomesticoRepository } from 'src/app/_repositories/uso-elettrodomestico-repository';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { LetturaElettrodomesticoDto } from 'src/app/dto/lettura-elettrodomestico-dto';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LetturaElettrodomesticiComponent } from '../lettura-elettrodomestici/lettura-elettrodomestici.component';

@Component({
  selector: 'app-uso-elettrodomestico',
  templateUrl: './uso-elettrodomestico.component.html',
  styleUrls: ['./uso-elettrodomestico.component.scss'],
})
export class UsoElettrodomesticoComponent {
  @Input()
  uso: LetturaElettrodomesticoDto | undefined;
  @Input()
  nascondiPulsanti = false;
  @Output()
  modified: EventEmitter<void> = new EventEmitter();
  constructor(
    private usoEletRepo: UsoElettrodomesticoRepository,
    public dialog: MatDialog,
    private snackBar: SnackbarService
  ) {}

  getNote(): string {
    if (this.uso?.note && this.uso.note.length > 0) return ' ' + this.uso.note;
    return '';
  }

  getDurata(): string {
    let durata = '';
    if (this.uso?.ore) durata += this.uso?.ore + 'h';
    if (this.uso?.minuti)
      durata += (durata.length > 0 ? ' ' : '') + this.uso?.minuti + 'm';
    if (durata.length > 0) durata = ' (' + durata + ')';
    return durata;
  }

  modifica() {
    if (this.uso) {
      const dialogRef = this.dialog.open(LetturaElettrodomesticiComponent, {
        data: { uso: this.uso },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.usoEletRepo.save(result).subscribe({
            next: (data) => {
              this.snackBar.success('Uso modificato');
              this.modified.emit();
            },
            error: (err) => {
              console.log('errore update: ', err);
              this.snackBar.error('Errore modifica uso: ' + err);
            },
            complete: () => {},
          });
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
      if (result && this.uso) {
        this.usoEletRepo.deleteById(this.uso.id).subscribe({
          next: (data) => {
            this.modified.emit();
          },
          error: (err) => console.log('errore update: ', err),
          complete: () => {},
        });
      }
    });
  }
}
