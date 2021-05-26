import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { CustomerDialogServiceService } from './customer-dialog/customer-dialog-service.service';


@NgModule({
  declarations: [
    CustomerDialogComponent
  ],
  imports: [
    CustomersRoutingModule,
    SharedModule
  ],
  providers: [CustomerDialogServiceService]
})
export class CustomersModule { }
