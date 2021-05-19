import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSteelHomeComponent } from './vehicle-steel-home/vehicle-steel-home.component';

const routes: Routes = [
  { path: '',  component: VehicleSteelHomeComponent, /* canActivate: [AuthGuard],  */pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleSteelRoutingModule { }
