import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AggiungiLetturaComponent } from '@components/aggiungi-lettura/aggiungi-lettura.component';
import { Lettura } from '@db/db';
import { roundTo } from '@functions/utils';
import { CambioAnnoService } from '@services/cambio-anno.service';

@Component({
  selector: 'app-edit-lettura',
  templateUrl: './edit-lettura.component.html',
  styleUrls: ['./edit-lettura.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
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
    const giornoPrima = this.utils.getGiornoPrima(this.lettura!.giorno);
    this.cambioAnnoService.getForGiorno(this.lettura!.giorno).subscribe({
      next: (currCamb) => {
        this.giornoCambioBaseline =
          currCamb.dateBaseLine.toUTCString() === giornoPrima.toUTCString();
      },
    });
    this.service.repository.getByGiorno(giornoPrima).subscribe({
      next: (data) => (this.letturaPrevG = data[0]?.lettura ?? 0),
    });
  }

  override salva() {
    const lettura = this.form.get('lettura')?.value;
    const consumo = this.form.get('consumo')?.value;
    if (lettura === 0 && consumo !== 0) {
      const letturaVal = this.giornoCambioBaseline
        ? consumo
        : consumo + this.letturaPrevG;
      this.form.get('lettura')?.setValue(roundTo(letturaVal, 3));
    }

    super.salva();
    this.dialogRef.close();
  }

  chiudi() {
    this.dialogRef.close();
  }
}
