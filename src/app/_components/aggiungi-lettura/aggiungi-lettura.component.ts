import { Component, Input, OnInit } from '@angular/core';
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
  @Input()
  lettura: Lettura | undefined;
  form: FormGroup = new FormGroup([]);
  constructor(private service: LetturaService, private builder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      lettura: new FormControl(this.lettura?.lettura, [Validators.required]),
      giorno: new FormControl(this.lettura?.giorno, Validators.required),
    });
  }

  salva() {
    this.lettura = {
      id: this.lettura?.id,
      lettura: this.form.get('lettura')?.value,
      giorno: this.form.get('giorno')?.value,
    } as Lettura;
    this.lettura.giorno.setHours(0, 0, 0, 0);
    this.service.salva(this.lettura).subscribe({
      next: (data) => {
        console.log('save ok: ', data);
      },
      error: (err) => console.log('errore salvataggio lettura: ', err),
      complete: () => {},
    });
  }
}
