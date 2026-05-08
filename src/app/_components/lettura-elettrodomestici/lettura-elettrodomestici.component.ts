import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Elettrodomestico, UsoElettrodomestico } from  '@db/db';
import { ElettrodomesticoRepository } from  '@repositories/elettrodomestico-repository';
import { SnackbarService } from  '@services/snackbar.service';
import { UtilsService } from  '@services/utils.service';
import { LetturaDto } from  '@dto/lettura-dto';
import { LetturaElettrodomesticoDto } from  '@dto/lettura-elettrodomestico-dto';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lettura-elettrodomestici',
  templateUrl: './lettura-elettrodomestici.component.html',
  styleUrls: ['./lettura-elettrodomestici.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class LetturaElettrodomesticiComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<{
    lettura: LetturaDto;
    uso: LetturaElettrodomesticoDto;
  }>(MAT_DIALOG_DATA);
  private readonly builder = inject(FormBuilder);
  private readonly elettrRepo = inject(ElettrodomesticoRepository);
  private readonly snackBar = inject(SnackbarService);
  private readonly utils = inject(UtilsService);

  uso: LetturaElettrodomesticoDto | undefined = this.data.uso;
  form: FormGroup = new FormGroup([]);
  elett: Elettrodomestico[] = [];
  lettura: LetturaDto = this.data.lettura;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.elettrRepo.getAll().subscribe({
      next: (data) =>
        (this.elett = data.sort((a, b) => a.nome.localeCompare(b.nome))),
      error: (err) => {
        this.snackBar.error('Errore caricamento elettrodomestici: ' + err);
      },
    });
    this.initForm();
  }

  initForm() {
    this.form = this.builder.group({
      elettrodomesticoId: new FormControl(
        this.uso?.elettrodomestico.id,
        Validators.required
      ),
      durataMin: new FormControl(this.uso?.minuti),
      durataOre: new FormControl(this.uso?.ore),
      giorno: new FormControl(
        { value: this.uso?.giorno || this.lettura.giorno, disabled: true },
        Validators.required
      ),
      note: new FormControl(this.uso?.note),
      dal: new FormControl(undefined),
      al: new FormControl(undefined),
    });
  }

  durataValida(): boolean {
    const ore = this.form.get('durataOre')?.value;
    const minuti = this.form.get('durataMin')?.value;
    return (
      (ore !== undefined && ore !== null) ||
      (minuti !== undefined && minuti !== null)
    );
  }

  salva() {
    const dal = this.form.get('dal')?.value;
    const al = this.form.get('al')?.value;
    if (dal && al) {
      const usi = [];
      const giorniDiff = this.utils.getDiffGiorni(dal, al);
      for (let giorno = 0; giorno <= giorniDiff; giorno++) {
        const giornoDaSalvare = this.utils.aggiungiGiorni(dal, giorno);
        const uso = {
          id: this.uso?.id,
          elettrodomesticoId: this.form.get('elettrodomesticoId')?.value,
          note: this.form.get('note')?.value,
          ore: this.form.get('durataOre')?.value,
          minuti: this.form.get('durataMin')?.value,
          giorno: giornoDaSalvare,
        } as UsoElettrodomestico;
        usi.push(uso);
        this.dialogRef.close(usi);
      }
    } else {
      const uso = {
        id: this.uso?.id,
        elettrodomesticoId: this.form.get('elettrodomesticoId')?.value,
        note: this.form.get('note')?.value,
        ore: this.form.get('durataOre')?.value,
        minuti: this.form.get('durataMin')?.value,
        giorno: this.form.get('giorno')?.value,
      } as UsoElettrodomestico;
      this.dialogRef.close(uso);
    }
  }

  annulla() {
    this.dialogRef.close();
  }
}
