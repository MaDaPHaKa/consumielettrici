import { Component, Input } from '@angular/core';
import { LetturaElettrodomesticoDto } from 'src/app/dto/lettura-elettrodomestico-dto';

@Component({
  selector: 'app-uso-elettrodomestico',
  templateUrl: './uso-elettrodomestico.component.html',
  styleUrls: ['./uso-elettrodomestico.component.scss'],
})
export class UsoElettrodomesticoComponent {
  @Input()
  uso: LetturaElettrodomesticoDto | undefined;

  getDurataLeggibile(): string {
    // 1- Convert to seconds:
    if (this.uso) {
      let seconds = this.uso.durata / 1000;
      // 2- Extract hours:
      const hours = seconds / 3600; // 3,600 seconds in 1 hour
      seconds = seconds % 3600; // seconds remaining after extracting hours
      // 3- Extract minutes:
      const minutes = seconds / 60; // 60 seconds in 1 minute
      return hours + 'h ' + minutes + 'm ';
    }
    return '';
  }

  modifica() {
    if (this.uso) {
    }
  }
}
