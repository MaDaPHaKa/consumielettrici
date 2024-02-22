import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, forkJoin, of } from 'rxjs';
import { UsoElettrodomesticoRepository } from 'src/app/_repositories/uso-elettrodomestico-repository';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AbstractLettureSearch } from 'src/app/abstract/abstract-letture-search';
import { LetturaDto } from 'src/app/dto/lettura-dto';
import { LetturaFilterDto } from 'src/app/dto/lettura-filter-dto';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LetturaElettrodomesticiComponent } from '../lettura-elettrodomestici/lettura-elettrodomestici.component';

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
export class LettureComponent extends AbstractLettureSearch implements OnInit {
  displayedColumns = [
    'data',
    'giorno',
    'lettura',
    'elettrodomestici',
    'consumo',
    'escludiDaMedia',
    'escludiDaMinMax',
    'azioni',
  ];
  constructor(
    private service: LetturaService,
    private usoEletRepo: UsoElettrodomesticoRepository,
    public dialog: MatDialog,
    private utils: UtilsService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => {
        this.allData = data;
        this.cerca(new LetturaFilterDto());
      },
      error: (err) => {
        console.log('Errore load letture', err);
        this.snackBar.error('Errore caricamento letture: ' + err);
      },
      complete: () => {},
    });
  }

  giornoSettimana(d: Date) {
    return this.utils.giornoSettimana(d);
  }

  elimina(toDelete: LetturaDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Elimino?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.elimina(toDelete).subscribe({
          next: (data) => {
            this.snackBar.success('Lettura eliminata');
          },
          error: (err) => {
            console.log('errore cancellazione: ', err);
            this.snackBar.error('Errore cancellazione lettura: ' + err);
          },
          complete: () => {},
        });
      }
    });
  }
  espandi(element: LetturaDto) {
    element.expanded = !element.expanded;
  }

  aggiungiElettrodomestico(lettura: LetturaDto) {
    const dialogRef = this.dialog.open(LetturaElettrodomesticiComponent, {
      data: { lettura: lettura },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (Array.isArray(result)) {
          const saves$ = result.map((el) =>
            this.usoEletRepo.save(el).pipe(
              catchError((err) => {
                console.log('errore salvataggio multiplo: ', err);
                this.snackBar.error(err);
                return of(undefined);
              })
            )
          );
          forkJoin(saves$).subscribe({
            next: (data) => {},
            complete: () => {
              this.snackBar.success('Salvataggio completato.');
              this.ngOnInit();
            },
          });
        } else {
          this.usoEletRepo.save(result).subscribe({
            next: (data) => {
              this.snackBar.success('Utilizzo salvato');
            },
            error: (err) => {
              console.log('errore cancellazione: ', err);
              this.snackBar.error('Errore salvataggio utilizzo: ' + err);
            },
            complete: () => this.ngOnInit(),
          });
        }
      }
    });
  }

  onUsoUpdate(event: any) {
    this.ngOnInit();
  }

  async ricalcolaConsumi() {
    const val$ = await this.service.ricalcolaConsumi();
    forkJoin(val$).subscribe({
      next: (data) => {
        this.snackBar.success('Aggiornamento consumi completato');
      },
      error: (err) => {
        console.log('errore update consumi: ', err);
        this.snackBar.error('Errore update consumi: ' + err);
      },
      complete: () => {},
    });
  }

  afterFilter() {
    this.dataSource.sort((a, b) => b.giorno.getTime() - a.giorno.getTime());
  }
}
