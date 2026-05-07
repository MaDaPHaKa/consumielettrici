import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CambioAnno } from 'src/app/_db/db';
import { CambioAnnoService } from 'src/app/_services/cambio-anno.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

interface DialogData {
  cambio: CambioAnno;
}

@Component({
    selector: 'app-cambio-anno-dialog',
    templateUrl: './cambio-anno-dialog.component.html',
    styleUrls: ['./cambio-anno-dialog.component.scss'],
    standalone: false
})
export class CambioAnnoDialogComponent implements OnInit {
  form: FormGroup = new FormGroup([]);
  ricalcolaConsumi = true;

  constructor(
    private builder: FormBuilder,
    private service: CambioAnnoService,
    private snackBar: SnackbarService,
    private dialogRef: MatDialogRef<CambioAnnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    const c = this.data.cambio;
    this.form = this.builder.group({
      anno: new FormControl(c.anno, [Validators.required]),
      dateBaseLine: new FormControl(c.dateBaseLine, [Validators.required]),
      lastBaseline: new FormControl(c.lastBaseline, [
        Validators.required,
        Validators.min(0),
      ]),
      note: new FormControl(c.note ?? ''),
    });
  }

  salva() {
    if (this.form.invalid) return;
    const updated: CambioAnno = {
      id: this.data.cambio.id,
      anno: this.form.get('anno')?.value,
      dateBaseLine: this.form.get('dateBaseLine')?.value,
      lastBaseline: this.form.get('lastBaseline')?.value,
      note: this.form.get('note')?.value,
    };
    this.service.salva(updated).subscribe({
      next: () => {
        this.dialogRef.close({
          salvato: true,
          ricalcola: this.ricalcolaConsumi,
        });
      },
      error: (err) => this.snackBar.error('Errore salvataggio: ' + err),
    });
  }

  chiudi() {
    this.dialogRef.close();
  }
}
