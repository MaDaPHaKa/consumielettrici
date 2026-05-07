import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Lettura } from 'src/app/_db/db';
import { CambioAnnoService } from 'src/app/_services/cambio-anno.service';
import { AggiungiLetturaComponent } from '../aggiungi-lettura/aggiungi-lettura.component';

@Component({
  selector: 'app-edit-lettura',
  templateUrl: './edit-lettura.component.html',
  styleUrls: ['./edit-lettura.component.scss'],
})
export class EditLetturaComponent extends AggiungiLetturaComponent {
  readonly dialogRef = inject(MatDialogRef<EditLetturaComponent>);
  readonly data = inject<Lettura>(MAT_DIALOG_DATA);
  private readonly cambioAnnoService = inject(CambioAnnoService);
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
    const giornoPrima = this.utils.getGiornoPrima(this.lettura.giorno);
    this.cambioAnnoService.getForGiorno(this.lettura.giorno).subscribe({
      next: (currCamb) => {
        this.giornoCambioBaseline =
          currCamb.dateBaseLine.toUTCString() === giornoPrima.toUTCString();
      },
    });
    this.service.repository
      .getByGiorno(giornoPrima)
      .subscribe({ next: (data) => (this.letturaPrevG = data[0]?.lettura ?? 0) });
  }

  override salva() {
    const lettura = this.form.get('lettura')?.value;
    const consumo = this.form.get('consumo')?.value;
    if (lettura === 0 && consumo !== 0) {
      const letturaVal = this.giornoCambioBaseline
        ? consumo
        : consumo + this.letturaPrevG;
      this.form.get('lettura')?.setValue(letturaVal);
    }

    super.salva();
    this.dialogRef.close();
  }

  chiudi() {
    this.dialogRef.close();
  }
}
