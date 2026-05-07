import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, forkJoin, of } from 'rxjs';
import { Lettura } from 'src/app/_db/db';
import { UsoElettrodomesticoRepository } from 'src/app/_repositories/uso-elettrodomestico-repository';
import { LetturaService } from 'src/app/_services/lettura.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UsoElettrodomesticoService } from 'src/app/_services/uso-elettrodomestico.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AbstractLettureSearch } from 'src/app/abstract/abstract-letture-search';
import { LetturaDto } from 'src/app/dto/lettura-dto';
import { LetturaFilterDto } from 'src/app/dto/lettura-filter-dto';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditLetturaComponent } from '../edit-lettura/edit-lettura.component';
import { LetturaElettrodomesticiComponent } from '../lettura-elettrodomestici/lettura-elettrodomestici.component';
import { LettureFilterComponent } from '../letture-filter/letture-filter.component';
import { UsoElettrodomesticoComponent } from '../uso-elettrodomestico/uso-elettrodomestico.component';

@Component({
  selector: 'app-letture',
  templateUrl: './letture.component.html',
  styleUrls: ['./letture.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    LettureFilterComponent,
    UsoElettrodomesticoComponent,
  ],
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
export class LettureComponent
  extends AbstractLettureSearch
  implements OnInit, AfterViewInit
{
  private readonly service = inject(LetturaService);
  private readonly usoEletRepo = inject(UsoElettrodomesticoRepository);
  private readonly usoEletService = inject(UsoElettrodomesticoService);
  readonly dialog = inject(MatDialog);
  private readonly utils = inject(UtilsService);
  private readonly snackBar = inject(SnackbarService);

  pageSize = 20;
  totalSize = 0;
  currentPage = 0;
  paginated: MatTableDataSource<LetturaDto> =
    new MatTableDataSource<LetturaDto>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
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

  ngOnInit(): void {
    this.service.getTableValues().subscribe({
      next: (data) => {
        this.allData = data;
        this.cerca(new LetturaFilterDto());
      },
      error: (err) => {
        this.snackBar.error('Errore caricamento letture: ' + err);
      },
    });
  }

  ngAfterViewInit() {
    if (this.paginated) this.paginated.paginator = this.paginator;
  }

  giornoSettimana(d: Date) {
    return this.utils.giornoSettimana(d);
  }

  aggiungi() {
    this.service.repository.orderedByGiorno().subscribe({
      next: (data) => {
        const nextDay = this.utils.aggiungiGiorni(data.reverse()[0].giorno, 1);
        const lettura = {
          lettura: 0,
          giorno: nextDay,
        } as Lettura;
        this.service.salva(lettura).subscribe({
          next: () => {
            this.snackBar.success('Lettura salvata.');
          },
          error: (err) => {
            this.snackBar.error('Errore salvataggio lettura: ' + err);
          },
        });
      },
    });
  }

  elimina(toDelete: LetturaDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Elimino?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.elimina(toDelete).subscribe({
          next: () => {
            this.dataSource = this.dataSource.filter(
              (el) => el.id !== toDelete.id
            );
            this.snackBar.success('Lettura eliminata');
          },
          error: (err) => {
            this.snackBar.error('Errore cancellazione lettura: ' + err);
          },
        });
      }
    });
  }

  edit(element: LetturaDto) {
    const dialogRef = this.dialog.open(EditLetturaComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe();
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
                this.snackBar.error(err);
                return of(undefined);
              })
            )
          );
          forkJoin(saves$).subscribe({
            complete: () => {
              this.snackBar.success('Salvataggio completato.');
              this.ngOnInit();
            },
          });
        } else {
          this.usoEletRepo.save(result).subscribe({
            next: () => {
              this.usoEletService.getByGiorno(lettura.giorno).subscribe({
                next: (data) => {
                  lettura.elettrodomestici = data;
                },
              });
              this.snackBar.success('Utilizzo salvato');
            },
            error: (err) => {
              this.snackBar.error('Errore salvataggio utilizzo: ' + err);
            },
          });
        }
      }
    });
  }

  onUsoUpdate(_event: any) {
    this.ngOnInit();
  }

  ricalcolaConsumi() {
    this.service.ricalcolaConsumi().subscribe({
      next: () => {
        this.snackBar.success('Aggiornamento consumi completato');
      },
      error: (err) => {
        this.snackBar.error('Errore update consumi: ' + err);
      },
    });
  }

  afterFilter() {
    this.dataSource.sort((a, b) => b.giorno.getTime() - a.giorno.getTime());
    this.paginated = new MatTableDataSource(this.dataSource);
    this.paginated.paginator = this.paginator;
  }
}
