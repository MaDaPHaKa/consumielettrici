import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { exportDB, importInto } from 'dexie-export-import';
import * as FileSaver from 'file-saver-es';
import { EMPTY, Observable, from, switchMap } from 'rxjs';
import { db, SEED_CAMBI_ANNO } from 'src/app/_db/db';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [MatToolbarModule, RouterLink],
})
export class NavbarComponent {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(SnackbarService);

  importFile: File | null = null;

  export() {
    from(exportDB(db)).subscribe({
      next: (exportFile) => {
        const file = new File([exportFile], 'consumi.json');
        FileSaver.saveAs(file);
      },
      error: (err) => this.snackBar.error('Errore export: ' + err),
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.importFile = fileList.item(0);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message:
            'Importare DB? ATTENZIONE: perdi tutti i dati non backuppati!!',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.importa();
        }
      });
    }
  }

  importa() {
    if (!this.importFile) return;
    from(
      importInto(db, this.importFile, {
        clearTablesBeforeImport: true,
        acceptVersionDiff: true,
      })
    )
      .pipe(switchMap(() => this.seedCambiAnnoIfEmpty()))
      .subscribe({
        next: () => this.snackBar.success('Import completato.'),
        error: (err) => this.snackBar.error('Errore import: ' + err),
      });
  }

  private seedCambiAnnoIfEmpty(): Observable<unknown> {
    return from(db.cambiAnno.count()).pipe(
      switchMap((count) => {
        if (count > 0) return EMPTY;
        return from(
          db.cambiAnno.bulkAdd(
            SEED_CAMBI_ANNO.map((c) => ({
              ...c,
              note: 'Seed post-import (backup v3)',
            }))
          )
        );
      })
    );
  }
}
