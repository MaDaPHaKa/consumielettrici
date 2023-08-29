import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Elettrodomestico, UsoElettrodomestico } from 'src/app/_db/db';
import { LetturaService } from 'src/app/_services/lettura.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LetturaDto } from 'src/app/dto/lettura-dto';
import { LetturaElettrodomesticoDto } from 'src/app/dto/lettura-elettrodomestico-dto';
import { ElettrodomesticoRepository } from 'src/app/_repositories/elettrodomestico-repository';

@Component({
  selector: 'app-lettura-elettrodomestici',
  templateUrl: './lettura-elettrodomestici.component.html',
  styleUrls: ['./lettura-elettrodomestici.component.scss'],
})
export class LetturaElettrodomesticiComponent implements OnInit {
  @Input()
  uso: LetturaElettrodomesticoDto | undefined;
  form: FormGroup = new FormGroup([]);
  elett: Elettrodomestico[] = [];
  lettura: LetturaDto;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lettura: LetturaDto },
    private builder: FormBuilder,
    private elettrRepo: ElettrodomesticoRepository
  ) {
    this.lettura = data.lettura;
    this.form = this.builder.group({
      elettrodomesticoId: new FormControl(
        this.uso?.elettrodomestico.id,
        Validators.required
      ),
      durataMin: new FormControl(this.uso?.durata),
      durataOre: new FormControl(this.uso?.durata),
      giorno: new FormControl(
        this.uso?.giorno || this.lettura.giorno,
        Validators.required
      ),
      note: new FormControl(this.uso?.note),
    });
  }

  ngOnInit(): void {
    this.elettrRepo.getAll().subscribe({
      next: (data) => (this.elett = data),
      error: (err) => console.log('errore load: ', err),
      complete: () => {},
    });
    this.form = this.builder.group({
      elettrodomesticoId: new FormControl(
        this.uso?.elettrodomestico.id,
        Validators.required
      ),
      durataMin: new FormControl(this.uso?.durata),
      durataOre: new FormControl(this.uso?.durata),
      giorno: new FormControl(
        this.uso?.giorno || this.lettura.giorno,
        Validators.required
      ),
      note: new FormControl(this.uso?.note),
    });
  }
  durataValida(): boolean {
    const ore = this.form.get('durataOre')?.value;
    const minuti = this.form.get('durataMin')?.value;
    return (
      (ore !== undefined && ore !== null) ||
      (minuti !== undefined && ore !== null)
    );
  }

  getDurata(): number {
    let ore = this.form.get('durataOre')?.value;
    let minuti = this.form.get('durataMin')?.value;
    if (ore) ore = ore * 60 * 60 * 1000;
    else ore = 0;
    if (minuti) minuti = minuti * 60 * 1000;
    else minuti = 0;
    return ore + minuti;
  }

  salva() {
    const uso = {
      id: this.uso?.id,
      elettrodomesticoId: this.form.get('elettrodomesticoId')?.value,
      note: this.form.get('note')?.value,
      durata: this.getDurata(), //durata in millisecondi
      giorno: this.form.get('giorno')?.value,
    } as UsoElettrodomestico;
    this.dialogRef.close(uso);
  }
  annulla() {
    this.dialogRef.close();
  }
}
