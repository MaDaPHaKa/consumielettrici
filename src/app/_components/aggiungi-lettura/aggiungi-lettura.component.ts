import { Component, inject, input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Lettura } from 'src/app/_db/db';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-aggiungi-lettura',
  templateUrl: './aggiungi-lettura.component.html',
  styleUrls: ['./aggiungi-lettura.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AggiungiLetturaComponent implements OnInit {
  protected readonly service = inject(LetturaService);
  protected readonly builder = inject(FormBuilder);
  private readonly snackBar = inject(SnackbarService);
  protected readonly utils = inject(UtilsService);

  readonly letturaInput = input<Lettura | undefined>(undefined, {
    alias: 'lettura',
  });

  lettura: Lettura | undefined;
  form: FormGroup = new FormGroup([]);

  ngOnInit(): void {
    this.lettura = this.letturaInput();
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
      escludiDaMedia: new FormControl(this.lettura?.escludiDaMedia),
      escludiDaMinMax: new FormControl(this.lettura?.escludiDaMinMax),
    });
  }

  salva() {
    this.lettura = {
      id: this.lettura?.id,
      lettura: this.form.get('lettura')?.value,
      giorno: this.form.get('giorno')?.value,
      escludiDaMedia: this.form.get('escludiDaMedia')?.value,
      escludiDaMinMax: this.form.get('escludiDaMinMax')?.value,
    } as Lettura;

    this.service.salva(this.lettura).subscribe({
      next: () => {
        this.snackBar.success('Lettura salvata.');
      },
      error: (err) => {
        this.snackBar.error('Errore salvataggio lettura: ' + err);
      },
    });
  }
}
