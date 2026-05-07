import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CambioAnno } from 'src/app/_db/db';
import { CambioAnnoService } from 'src/app/_services/cambio-anno.service';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { CambioAnnoDialogComponent } from '../cambio-anno-dialog/cambio-anno-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NuovoAnnoDialogComponent } from '../nuovo-anno-dialog/nuovo-anno-dialog.component';

@Component({
  selector: 'app-cambi-anno',
  templateUrl: './cambi-anno.component.html',
  styleUrls: ['./cambi-anno.component.scss'],
  imports: [CommonModule, MatButtonModule, MatTableModule],
})
export class CambiAnnoComponent implements OnInit {
  private readonly service = inject(CambioAnnoService);
  private readonly letturaService = inject(LetturaService);
  readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(SnackbarService);

  dataSource: CambioAnno[] = [];
  displayedColumns = ['anno', 'data', 'lastBaseline', 'note', 'azioni'];

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => (this.dataSource = data),
      error: (err) => {
        this.snackBar.error('Errore caricamento cambi anno: ' + err);
      },
    });
  }

  nuovoAnno() {
    const ref = this.dialog.open(NuovoAnnoDialogComponent, {
      width: '420px',
    });
    ref.afterClosed().subscribe((res) => {
      if (res?.ricalcola) this.ricalcolaTutto();
    });
  }

  modifica(cambio: CambioAnno) {
    const ref = this.dialog.open(CambioAnnoDialogComponent, {
      width: '420px',
      data: { cambio: { ...cambio } },
    });
    ref.afterClosed().subscribe((res) => {
      if (res?.salvato) {
        this.snackBar.success('Cambio anno aggiornato');
        if (res?.ricalcola) this.ricalcolaTutto();
      }
    });
  }

  elimina(cambio: CambioAnno) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Eliminare cambio anno ' +
          cambio.anno +
          '? I consumi calcolati potrebbero cambiare.',
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.service.elimina(cambio).subscribe({
        next: () => {
          this.snackBar.success('Cambio anno eliminato');
          this.ricalcolaTutto();
        },
        error: (err) => this.snackBar.error('Errore eliminazione: ' + err),
      });
    });
  }

  private ricalcolaTutto() {
    this.letturaService.ricalcolaConsumi().subscribe({
      next: (results) => {
        if (results.length === 0) return;
        this.snackBar.success('Consumi ricalcolati');
      },
      error: (err) => this.snackBar.error('Errore ricalcolo consumi: ' + err),
    });
  }
}
