import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lettura } from 'src/app/_db/db';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-aggiungi-lettura',
  templateUrl: './aggiungi-lettura.component.html',
  styleUrls: ['./aggiungi-lettura.component.scss'],
})
export class AggiungiLetturaComponent implements OnInit {
  @Input()
  lettura: Lettura | undefined;
  form: FormGroup = new FormGroup([]);
  constructor(
    private service: LetturaService,
    private builder: FormBuilder,
    private snackBar: SnackbarService,
    private utils: UtilsService
  ) {
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
    });
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
      escludiDaMedia: new FormControl(this.lettura?.escludiDaMedia),
      escludiDaMinMax: new FormControl(this.lettura?.escludiDaMinMax),
    });
  }

  async salva() {
    this.lettura = {
      id: this.lettura?.id,
      lettura: this.form.get('lettura')?.value,
      giorno: this.form.get('giorno')?.value,
      escludiDaMedia: this.form.get('escludiDaMedia')?.value,
      escludiDaMinMax: this.form.get('escludiDaMinMax')?.value,
    } as Lettura;
    this.service.salva(this.lettura).subscribe({
      next: (data) => {
        this.snackBar.success('Lettura salvata.');
      },
      error: (err) => {
        console.log('errore salvataggio lettura: ', err);
        this.snackBar.error('Errore salvataggio lettura: ' + err);
      },
      complete: () => { },
    });
  }
}
