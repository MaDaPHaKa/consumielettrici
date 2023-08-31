import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Elettrodomestico } from 'src/app/_db/db';
import { ElettrodomesticoRepository } from 'src/app/_repositories/elettrodomestico-repository';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ElettrodomesticoService } from 'src/app/_services/elettrodomestico.service';
import { ElettrodomesticoTableDto } from 'src/app/dto/elettrodomestico-table-dto';

@Component({
  selector: 'app-elettrodomestici',
  templateUrl: './elettrodomestici.component.html',
  styleUrls: ['./elettrodomestici.component.scss'],
})
export class ElettrodomesticiComponent {
  nuovo?: string;
  dataSource: ElettrodomesticoTableDto[] = [];
  displayedColumns = ['nome', 'azioni'];
  constructor(
    private repository: ElettrodomesticoRepository,
    private service: ElettrodomesticoService,
    public dialog: MatDialog,
    private snackBar: SnackbarService
  ) {}

  async ngOnInit() {
    this.repository.getAll().subscribe({
      next: (data) => {
        this.dataSource = data.map((el) =>
          Object.assign(new ElettrodomesticoTableDto(), el)
        );
        this.dataSource.sort((a, b) => a.nome.localeCompare(b.nome));
        this.dataSource.forEach((el) =>
          this.service
            .canDelete(el)
            .then((res) => (el.canDelete = res))
            .catch((err) => {
              this.snackBar.error('Errore check canDelete: ' + err);
              console.log('errore load canDelete: ', err);
            })
        );
      },
      error: (err) => {
        console.log('Errore load letture', err);
        this.snackBar.error('Errore caricamento elettrodomestici: ' + err);
      },
      complete: () => {},
    });
  }

  aggiungi() {
    if (this.nuovo) {
      const elettr = { nome: this.nuovo } as ElettrodomesticoTableDto;
      this.salva(elettr);
    }
  }

  salva(el: ElettrodomesticoTableDto) {
    let { canDelete: _, ...entity } = el;
    this.repository.save(entity).subscribe({
      next: (data) => this.snackBar.success('Elettrodomestico salvato'),
      error: (err) => {
        console.log('errore salvataggio: ', err);
        this.snackBar.error('Errore salvataggio elettrodomestico: ' + err);
      },
      complete: () => {},
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
          next: (data) => this.snackBar.success('Elettrodomestico eliminato'),
          error: (err) => {
            console.log('errore cancellazione: ', err);
            this.snackBar.error(
              'Errore cancellazione elettrodomestico: ' + err
            );
          },
          complete: () => {},
        });
      }
    });
  }
}
