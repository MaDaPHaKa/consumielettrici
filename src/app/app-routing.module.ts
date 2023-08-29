import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AggiungiLetturaComponent } from './_components/aggiungi-lettura/aggiungi-lettura.component';
import { HomeComponent } from './_components/home/home.component';
import { LettureComponent } from './_components/letture/letture.component';
import { ElettrodomesticiComponent } from './elettrodomestici/elettrodomestici.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'letture', component: LettureComponent },
  { path: 'aggiungilettura', component: AggiungiLetturaComponent },
  { path: 'elettrodomestici', component: ElettrodomesticiComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
