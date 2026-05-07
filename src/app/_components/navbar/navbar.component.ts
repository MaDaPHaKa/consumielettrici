import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { exportDB, importInto } from 'dexie-export-import';
import * as FileSaver from 'file-saver-es';
import { db } from 'src/app/_db/db';
import { SEED_CAMBI_ANNO } from 'src/app/_db/db';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent {
  importFile: File | null = null;

  constructor(public dialog: MatDialog, private snackBar: SnackbarService) {}

  async export() {
    const exportFile = await exportDB(db);
    const file = new File([exportFile], 'consumi.json');
    FileSaver.saveAs(file);
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

  async importa() {
    if (this.importFile) {
      await importInto(db, this.importFile, {
        clearTablesBeforeImport: true,
        acceptVersionDiff: true,
      });
      await this.seedCambiAnnoIfEmpty();
      this.snackBar.success('Import completato.');
    }
  }

  private async seedCambiAnnoIfEmpty() {
    const count = await db.cambiAnno.count();
    if (count > 0) return;
    await db.cambiAnno.bulkAdd(
      SEED_CAMBI_ANNO.map((c) => ({ ...c, note: 'Seed post-import (backup v3)' }))
    );
  }
}
