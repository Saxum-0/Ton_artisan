import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListeComponent } from './liste/liste.component';
import { FicheComponent } from './fiche/fiche.component';
import { ErreurComponent } from './erreur/erreur.component';



  export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "liste", component: ListeComponent},
    { path: 'services', component: ListeComponent, data: { category: 'Services' } },
    { path: 'fabrication', component: ListeComponent, data: { category: 'Fabrication' } },
    { path: 'alimentation', component: ListeComponent, data: { category: 'Alimentation' } },
    { path: 'batiment', component: ListeComponent, data: { category: 'Bâtiment' } },    
    { path: "fiche/:id", component: FicheComponent },
    { path: '404', component: ErreurComponent },
    { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
