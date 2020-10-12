import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StackedChartComponent } from './stacked-chart/stacked-chart.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'chart' },
  { path: 'chart', component: StackedChartComponent },
  { path: 'about', component: AboutComponent },
  {path: '**', component: NotFoundComponent} //TOdo: resolve service

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
