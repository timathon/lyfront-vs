import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './shared/components/login/login.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
const routes: Routes = [
  {
    path: '', children: [
      // { path: '', canActivate: [AuthGuard], component: DashboardComponent, pathMatch: 'full' },
      { path: '', redirectTo: '/vehicle-steel', pathMatch: 'full' },
      {
        path: 'vehicle-steel',
        canActivate: [AuthGuard],
        loadChildren: () => import('./vehicle-steel/vehicle-steel.module').then(m => m.VehicleSteelModule)
      },
      { path: 'login', component: LoginComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
