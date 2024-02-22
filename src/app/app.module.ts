import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AggiungiLetturaComponent } from './_components/aggiungi-lettura/aggiungi-lettura.component';
import { ChartsComponent } from './_components/charts/charts.component';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';
import { ElettrodomesticiComponent } from './_components/elettrodomestici/elettrodomestici.component';
import { HomeComponent } from './_components/home/home.component';
import { LetturaElettrodomesticiComponent } from './_components/lettura-elettrodomestici/lettura-elettrodomestici.component';
import { LettureComponent } from './_components/letture/letture.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { UsoElettrodomesticoComponent } from './_components/uso-elettrodomestico/uso-elettrodomestico.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LettureFilterComponent } from './_components/letture-filter/letture-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    AggiungiLetturaComponent,
    HomeComponent,
    LettureComponent,
    UsoElettrodomesticoComponent,
    ConfirmDialogComponent,
    LetturaElettrodomesticiComponent,
    ElettrodomesticiComponent,
    NavbarComponent,
    ChartsComponent,
    LettureFilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
