import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CambioAnno } from 'src/app/_db/db';
import { CambioAnnoService } from 'src/app/_services/cambio-anno.service';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CambioAnnoDialogComponent } from '../cambio-anno-dialog/cambio-anno-dialog.component';
import { NuovoAnnoDialogComponent } from '../nuovo-anno-dialog/nuovo-anno-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-cambi-anno',
    templateUrl: './cambi-anno.component.html',
    styleUrls: ['./cambi-anno.component.scss'],
    standalone: false
})
export class CambiAnnoComponent implements OnInit {
  dataSource: CambioAnno[] = [];
  displayedColumns = ['anno', 'data', 'lastBaseline', 'note', 'azioni'];

  constructor(
    private service: CambioAnnoService,
    private letturaService: LetturaService,
    public dialog: MatDialog,
    private snackBar: SnackbarService
  ) {}

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
        error: (err) =>
          this.snackBar.error('Errore eliminazione: ' + err),
      });
    });
  }

  private async ricalcolaTutto() {
    const obs = await this.letturaService.ricalcolaConsumi();
    if (obs.length === 0) return;
    forkJoin(obs).subscribe({
      next: () => this.snackBar.success('Consumi ricalcolati'),
      error: (err) =>
        this.snackBar.error('Errore ricalcolo consumi: ' + err),
    });
  }
}
