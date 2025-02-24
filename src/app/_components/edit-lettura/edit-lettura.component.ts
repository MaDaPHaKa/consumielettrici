import { Component, inject } from '@angular/core';
import { AggiungiLetturaComponent } from '../aggiungi-lettura/aggiungi-lettura.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lettura } from 'src/app/_db/db';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-lettura',
  templateUrl: './edit-lettura.component.html',
  styleUrls: ['./edit-lettura.component.scss'],
})
export class EditLetturaComponent extends AggiungiLetturaComponent {
  readonly dialogRef = inject(MatDialogRef<EditLetturaComponent>);
  readonly data = inject<Lettura>(MAT_DIALOG_DATA);
  letturaPrevG = 0;

  override ngOnInit(): void {
    this.lettura = this.data;
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      consumo: new FormControl(this.lettura?.consumo, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
      escludiDaMedia: new FormControl(this.lettura?.escludiDaMedia),
      escludiDaMinMax: new FormControl(this.lettura?.escludiDaMinMax),
    });
    this.service.repository
      .getByGiorno(this.utils.getGiornoPrima(this.lettura.giorno))
      .subscribe({ next: (data) => (this.letturaPrevG = data[0].lettura) });
  }

  override salva() {
    const lettura = this.form.get('lettura')?.value;
    const consumo = this.form.get('consumo')?.value;
    if (lettura === 0 && consumo !== 0) {
      this.form.get('lettura')?.setValue(consumo + this.letturaPrevG);
    }

    super.salva();
    this.dialogRef.close();
  }

  chiudi() {
    this.dialogRef.close();
  }
}
