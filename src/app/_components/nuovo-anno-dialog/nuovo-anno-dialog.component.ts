import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CambioAnno } from 'src/app/_db/db';
import { CambioAnnoService } from 'src/app/_services/cambio-anno.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-nuovo-anno-dialog',
  templateUrl: './nuovo-anno-dialog.component.html',
  styleUrls: ['./nuovo-anno-dialog.component.scss'],
})
export class NuovoAnnoDialogComponent implements OnInit {
  form: FormGroup = new FormGroup([]);
  override = false;
  proposed = 0;
  ricalcolaConsumi = true;

  constructor(
    private builder: FormBuilder,
    private service: CambioAnnoService,
    private snackBar: SnackbarService,
    private dialogRef: MatDialogRef<NuovoAnnoDialogComponent>
  ) {}

  ngOnInit(): void {
    const annoDefault = new Date().getFullYear() + 1;
    const dateDefault = new Date(annoDefault, 1, 1, 0, 0, 0, 0);
    this.form = this.builder.group({
      anno: new FormControl(annoDefault, [Validators.required]),
      dateBaseLine: new FormControl(dateDefault, [Validators.required]),
      lastBaseline: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.min(0),
      ]),
      note: new FormControl(''),
    });
    this.ricalcolaProposta();
    this.form.get('anno')?.valueChanges.subscribe(() => this.ricalcolaProposta());
    this.form
      .get('dateBaseLine')
      ?.valueChanges.subscribe(() => this.ricalcolaProposta());
  }

  ricalcolaProposta() {
    const anno = this.form.get('anno')?.value;
    const data = this.form.get('dateBaseLine')?.value;
    if (!anno || !data) return;
    this.service.proponiNuovoAnno(anno, new Date(data)).then((c) => {
      this.proposed = c.lastBaseline;
      if (!this.override)
        this.form.get('lastBaseline')?.setValue(c.lastBaseline);
    });
  }

  toggleOverride() {
    const ctrl = this.form.get('lastBaseline');
    if (this.override) ctrl?.enable();
    else {
      ctrl?.disable();
      ctrl?.setValue(this.proposed);
    }
  }

  salva() {
    if (this.form.invalid) return;
    const cambio: CambioAnno = {
      anno: this.form.get('anno')?.value,
      dateBaseLine: this.form.get('dateBaseLine')?.value,
      lastBaseline: this.form.get('lastBaseline')?.value ?? this.proposed,
      note: this.form.get('note')?.value || undefined,
    };
    this.service.salva(cambio).subscribe({
      next: () => {
        this.snackBar.success('Nuovo anno bolletta creato');
        this.dialogRef.close({
          salvato: true,
          ricalcola: this.ricalcolaConsumi,
        });
      },
      error: (err) => this.snackBar.error('Errore creazione anno: ' + err),
    });
  }

  chiudi() {
    this.dialogRef.close();
  }
}
