import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AggiungiLetturaComponent } from '@components/aggiungi-lettura/aggiungi-lettura.component';
import { Lettura } from '@db/db';
import { roundTo } from '@functions/utils';
import { CambioAnnoService } from '@services/cambio-anno.service';

type EditMode = 'lettura' | 'consumo';

@Component({
  selector: 'app-edit-lettura',
  templateUrl: './edit-lettura.component.html',
  styleUrls: ['./edit-lettura.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
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
  private readonly cdr = inject(ChangeDetectorRef);
  letturaPrevG = 0;
  giornoCambioBaseline = false;
  mode: EditMode = 'consumo';

  override ngOnInit(): void {
    this.lettura = this.data;
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      consumo: new FormControl(this.lettura?.consumo, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
      escludiDaMedia: new FormControl(this.lettura?.escludiDaMedia),
      escludiDaMinMax: new FormControl(this.lettura?.escludiDaMinMax),
    });
    this.applyMode();
    const giornoPrima = this.utils.getGiornoPrima(this.lettura!.giorno);
    this.cambioAnnoService.getForGiorno(this.lettura!.giorno).subscribe({
      next: (currCamb) => {
        this.giornoCambioBaseline =
          currCamb.dateBaseLine.toUTCString() === giornoPrima.toUTCString();
        this.cdr.markForCheck();
      },
    });
    this.service.repository.getByGiorno(giornoPrima).subscribe({
      next: (data) => {
        this.letturaPrevG = data[0]?.lettura ?? 0;
        this.cdr.markForCheck();
      },
    });
  }

  onModeChange(mode: EditMode) {
    this.mode = mode;
    this.applyMode();
  }

  private applyMode() {
    const letturaCtrl = this.form.get('lettura');
    const consumoCtrl = this.form.get('consumo');
    if (this.mode === 'lettura') {
      letturaCtrl?.enable({ emitEvent: false });
      consumoCtrl?.disable({ emitEvent: false });
    } else {
      consumoCtrl?.enable({ emitEvent: false });
      letturaCtrl?.disable({ emitEvent: false });
    }
  }

  override salva() {
    const lettura = this.form.get('lettura')?.value;
    const consumo = this.form.get('consumo')?.value;
    if (this.mode === 'consumo') {
      const letturaVal = this.giornoCambioBaseline
        ? consumo
        : consumo + this.letturaPrevG;
      this.form.get('lettura')?.setValue(roundTo(letturaVal, 3));
    } else if (lettura === 0 && consumo !== 0) {
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
