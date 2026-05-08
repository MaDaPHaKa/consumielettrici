import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CambioAnno } from  '@db/db';
import { CambioAnnoService } from  '@services/cambio-anno.service';
import { SnackbarService } from  '@services/snackbar.service';

interface DialogData {
  cambio: CambioAnno;
}

@Component({
  selector: 'app-cambio-anno-dialog',
  templateUrl: './cambio-anno-dialog.component.html',
  styleUrls: ['./cambio-anno-dialog.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambioAnnoDialogComponent implements OnInit {
  private readonly builder = inject(FormBuilder);
  private readonly service = inject(CambioAnnoService);
  private readonly snackBar = inject(SnackbarService);
  private readonly dialogRef = inject(
    MatDialogRef<CambioAnnoDialogComponent>
  );
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  form: FormGroup = new FormGroup([]);
  ricalcolaConsumi = true;

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
