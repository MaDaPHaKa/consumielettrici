import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LetturaService } from 'src/app/_services/lettura.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { LetturaDto } from 'src/app/dto/lettura-dto';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-letture',
  templateUrl: './letture.component.html',
  styleUrls: ['./letture.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class LettureComponent implements OnInit {
  dataSource: LetturaDto[] = [];
  displayedColumns = [
    'data',
    'giorno',
    'lettura',
    'elettrodomestici',
    'azioni',
  ];
  constructor(
    private service: LetturaService,
    public dialog: MatDialog,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.dataSource.sort((a, b) => a.giorno.getTime() - b.giorno.getTime());
      },
      error: (err) => console.log('Errore load letture', err),
      complete: () => {},
    });
  }

  giornoSettimana(d: Date) {
    return this.utils.giornoSettimana(d);
  }

  elimina(toDelete: LetturaDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
      data: { message: 'Elimino?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.elimina(toDelete).subscribe({
          next: (data) => {},
          error: (err) => console.log('errore cancellazione: ', err),
          complete: () => {},
        });
      }
    });
  }
  espandi(element: LetturaDto) {
    console.log('before toggle: ', element.expanded);
    element.expanded = !element.expanded;
    console.log('before toggle: ', element.expanded);
  }
}
