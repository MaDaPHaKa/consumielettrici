import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Lettura } from 'src/app/_db/db';
import { LetturaService } from 'src/app/_services/lettura.service';

@Component({
  selector: 'app-aggiungi-lettura',
  templateUrl: './aggiungi-lettura.component.html',
  styleUrls: ['./aggiungi-lettura.component.scss'],
})
export class AggiungiLetturaComponent implements OnInit {
  form: FormGroup = new FormGroup([]);
  constructor(private service: LetturaService, private builder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      lettura: new FormControl('', [Validators.required]),
      giorno: new FormControl('', Validators.required),
    });
  }

  salva() {
    const lettura = {
      lettura: this.form.get('lettura')?.value,
      giorno: this.form.get('giorno')?.value,
    } as Lettura;
    lettura.giorno.setHours(0, 0, 0, 0);
    console.log('salva');
    this.service.salva(lettura).subscribe({
      next: (data) => {
        console.log('save ok: ', data);
      },
      error: (err) => console.log('errore salvataggio lettura: ', err),
      complete: () => {},
    });
  }
}
