import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./_components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'letture',
    loadComponent: () =>
      import('./_components/letture/letture.component').then(
        (m) => m.LettureComponent
      ),
  },
  {
    path: 'aggiungilettura',
    loadComponent: () =>
      import('./_components/aggiungi-lettura/aggiungi-lettura.component').then(
        (m) => m.AggiungiLetturaComponent
      ),
  },
  {
    path: 'elettrodomestici',
    loadComponent: () =>
      import('./_components/elettrodomestici/elettrodomestici.component').then(
        (m) => m.ElettrodomesticiComponent
      ),
  },
  {
    path: 'cambi-anno',
    loadComponent: () =>
      import('./_components/cambi-anno/cambi-anno.component').then(
        (m) => m.CambiAnnoComponent
      ),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
