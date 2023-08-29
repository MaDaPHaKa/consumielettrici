import { Component, OnInit } from '@angular/core';
import { Lettura } from 'src/app/_db/db';
import { LetturaRepository } from 'src/app/_repositories/lettura-repository';
import { LetturaService } from 'src/app/_services/lettura.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { LetturaDto } from 'src/app/dto/lettura-dto';

@Component({
  selector: 'app-letture',
  templateUrl: './letture.component.html',
  styleUrls: ['./letture.component.scss'],
})
export class LettureComponent implements OnInit {
  dataSource: LetturaDto[] = [];
  displayedColumns = [
    'data',
    'giorno',
    'lettura',
    'elettrodomestici',
    'elimina',
  ];
  constructor(private service: LetturaService, private utils: UtilsService) {}

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => (this.dataSource = data),
      error: (err) => console.log('Errore load letture', err),
      complete: () => {},
    });
  }

  giornoSettimana(d: Date) {
    return this.utils.giornoSettimana(d);
  }

  elimina(toDelete: LetturaDto) {}
}
