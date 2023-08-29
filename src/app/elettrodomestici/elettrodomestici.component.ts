import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../_components/confirm-dialog/confirm-dialog.component';
import { Elettrodomestico } from '../_db/db';
import { ElettrodomesticoRepository } from '../_repositories/elettrodomestico-repository';
import { UtilsService } from '../_services/utils.service';

@Component({
  selector: 'app-elettrodomestici',
  templateUrl: './elettrodomestici.component.html',
  styleUrls: ['./elettrodomestici.component.scss'],
})
export class ElettrodomesticiComponent {
  nuovo?: string;
  dataSource: Elettrodomestico[] = [];
  displayedColumns = ['nome', 'azioni'];
  constructor(
    private repository: ElettrodomesticoRepository,
    public dialog: MatDialog,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.repository.getAll().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.dataSource.sort((a, b) => a.nome.localeCompare(b.nome));
      },
      error: (err) => console.log('Errore load letture', err),
      complete: () => {},
    });
  }

  aggiungi() {
    if (this.nuovo) {
      const elettr = { nome: this.nuovo } as Elettrodomestico;
      this.salva(elettr);
    }
  }

  salva(el: Elettrodomestico) {
    this.repository.save(el).subscribe({
      next: (data) => {},
      error: (err) => console.log('errore salvataggio: ', err),
      complete: () => {},
    });
    this.nuovo = undefined;
  }

  elimina(toDelete: Elettrodomestico) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
      data: { message: 'Elimino?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.repository.deleteByEntity(toDelete).subscribe({
          next: (data) => {},
          error: (err) => console.log('errore cancellazione: ', err),
          complete: () => {},
        });
      }
    });
  }
}
