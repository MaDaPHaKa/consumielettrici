import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AggiungiLetturaComponent } from './_components/aggiungi-lettura/aggiungi-lettura.component';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';
import { ElettrodomesticiComponent } from './_components/elettrodomestici/elettrodomestici.component';
import { HomeComponent } from './_components/home/home.component';
import { LetturaElettrodomesticiComponent } from './_components/lettura-elettrodomestici/lettura-elettrodomestici.component';
import { LettureComponent } from './_components/letture/letture.component';
import { UsoElettrodomesticoComponent } from './_components/uso-elettrodomestico/uso-elettrodomestico.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
