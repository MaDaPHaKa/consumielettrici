import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AggiungiLetturaComponent } from './_components/aggiungi-lettura/aggiungi-lettura.component';
import { CambiAnnoComponent } from './_components/cambi-anno/cambi-anno.component';
import { ElettrodomesticiComponent } from './_components/elettrodomestici/elettrodomestici.component';
import { HomeComponent } from './_components/home/home.component';
import { LettureComponent } from './_components/letture/letture.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'letture', component: LettureComponent },
  { path: 'aggiungilettura', component: AggiungiLetturaComponent },
  { path: 'elettrodomestici', component: ElettrodomesticiComponent },
  { path: 'cambi-anno', component: CambiAnnoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
