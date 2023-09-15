import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Elettrodomestico } from 'src/app/_db/db';
import { ElettrodomesticoRepository } from 'src/app/_repositories/elettrodomestico-repository';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { LetturaFilterDto } from 'src/app/dto/lettura-filter-dto';

@Component({
  selector: 'app-letture-filter',
  templateUrl: './letture-filter.component.html',
  styleUrls: ['./letture-filter.component.scss'],
})
export class LettureFilterComponent implements OnInit {
  @Output()
  cercaEvent: EventEmitter<LetturaFilterDto> =
    new EventEmitter<LetturaFilterDto>();
  elett: Elettrodomestico[] = [];
  @Input()
  dal: Date | undefined;
  @Input()
  al: Date | undefined;
  elettrodomestico: Elettrodomestico[] = [];

  constructor(
    private elettrRepo: ElettrodomesticoRepository,
    private snackBar: SnackbarService
  ) {}

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
  }

  cerca() {
    const filter = new LetturaFilterDto();
    filter.dal = this.dal;
    filter.al = this.al;
    filter.dal?.setHours(0, 0, 0, 0);
    filter.al?.setHours(0, 0, 0, 0);
    filter.elettrodomestico = this.elettrodomestico;
    this.cercaEvent.emit(filter);
  }
}
