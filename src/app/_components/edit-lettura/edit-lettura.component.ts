import { Component, inject } from '@angular/core';
import { AggiungiLetturaComponent } from '../aggiungi-lettura/aggiungi-lettura.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lettura } from 'src/app/_db/db';
import { FormControl, Validators } from '@angular/forms';
import { CambioAnno } from 'src/app/dto/cambio-anno';

@Component({
  selector: 'app-edit-lettura',
  templateUrl: './edit-lettura.component.html',
  styleUrls: ['./edit-lettura.component.scss'],
})
export class EditLetturaComponent extends AggiungiLetturaComponent {
  readonly dialogRef = inject(MatDialogRef<EditLetturaComponent>);
  readonly data = inject<Lettura>(MAT_DIALOG_DATA);
  letturaPrevG = 0;
  giornoCambioBaseline = false;

  override ngOnInit(): void {
    this.lettura = this.data;
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      consumo: new FormControl(this.lettura?.consumo, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
      escludiDaMedia: new FormControl(this.lettura?.escludiDaMedia),
      escludiDaMinMax: new FormControl(this.lettura?.escludiDaMinMax),
    });
    const currCamb = this.service.getCambioAnno(this.lettura.giorno);
    const giornoPrima = this.utils.getGiornoPrima(this.lettura.giorno)
    this.giornoCambioBaseline =  currCamb.dateBaseLine.toUTCString() === giornoPrima.toUTCString();
    this.service.repository
      .getByGiorno(giornoPrima)
      .subscribe({ next: (data) => (this.letturaPrevG = data[0].lettura) });
  }

  override salva() {
    const lettura = this.form.get('lettura')?.value;
    const consumo = this.form.get('consumo')?.value;
    if (lettura === 0 && consumo !== 0) {
      const letturaVal = this.giornoCambioBaseline ? consumo : consumo + this.letturaPrevG;
      this.form.get('lettura')?.setValue(letturaVal);
    }

    super.salva();
    this.dialogRef.close();
  }

  chiudi() {
    this.dialogRef.close();
  }
}
