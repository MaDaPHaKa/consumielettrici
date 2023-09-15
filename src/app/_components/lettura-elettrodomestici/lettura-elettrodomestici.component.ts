import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Elettrodomestico, UsoElettrodomestico } from 'src/app/_db/db';
import { ElettrodomesticoRepository } from 'src/app/_repositories/elettrodomestico-repository';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { LetturaDto } from 'src/app/dto/lettura-dto';
import { LetturaElettrodomesticoDto } from 'src/app/dto/lettura-elettrodomestico-dto';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-lettura-elettrodomestici',
  templateUrl: './lettura-elettrodomestici.component.html',
  styleUrls: ['./lettura-elettrodomestici.component.scss'],
})
export class LetturaElettrodomesticiComponent implements OnInit {
  uso: LetturaElettrodomesticoDto | undefined;
  form: FormGroup = new FormGroup([]);
  elett: Elettrodomestico[] = [];
  lettura: LetturaDto;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { lettura: LetturaDto; uso: LetturaElettrodomesticoDto },
    private builder: FormBuilder,
    private elettrRepo: ElettrodomesticoRepository,
    private snackBar: SnackbarService,
    private utils: UtilsService
  ) {
    this.lettura = data.lettura;
    this.uso = data.uso;
    this.initForm();
  }

  ngOnInit(): void {
    this.elettrRepo.getAll().subscribe({
      next: (data) =>
        (this.elett = data.sort((a, b) => a.nome.localeCompare(b.nome))),
      error: (err) => {
        console.log('errore load: ', err);
        this.snackBar.error('Errore caricamento elettrodomestici: ' + err);
      },
      complete: () => {},
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
