import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { VehicleSteelRoutingModule } from './vehicle-steel-routing.module';
import { VehicleSteelHomeComponent } from './vehicle-steel-home/vehicle-steel-home.component';
import { VehicleSteelWeighingSurveyComponent } from './vehicle-steel-weighing-survey/vehicle-steel-weighing-survey.component';
import { VehicleSteelWeighingSurveyDialogComponent } from './vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.component';
import { VehicleSteelWeighingSurveyRecentComponent } from './vehicle-steel-weighing-survey-recent/vehicle-steel-weighing-survey-recent.component';
import { VehicleSteelWeighingSurveyDialogService } from './vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.service';
import { CustomersModule } from '@app/customers/customers.module';
import { DecimalPipe } from '@angular/common';
import { VehicleSteelWeighingPrintComponent } from './vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-print/vehicle-steel-weighing-print.component';



@NgModule({
  declarations: [
    VehicleSteelHomeComponent,
    VehicleSteelWeighingSurveyComponent,
    VehicleSteelWeighingSurveyDialogComponent,
    VehicleSteelWeighingSurveyRecentComponent,
    VehicleSteelWeighingPrintComponent
  ],
  imports: [
    VehicleSteelRoutingModule,
    SharedModule,
    CustomersModule
  ],
  providers: [VehicleSteelWeighingSurveyDialogService, DecimalPipe],
})
export class VehicleSteelModule { }
