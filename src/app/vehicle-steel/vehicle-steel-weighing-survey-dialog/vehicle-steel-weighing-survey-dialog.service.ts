import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';
import { DataService } from '@app/shared/services/data.service';
import { Customer } from '@app/shared/services/data/data-customers';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { VehicleSteelWeighingSurveyDialogComponent } from './vehicle-steel-weighing-survey-dialog.component';


@Injectable()
export class VehicleSteelWeighingSurveyDialogService {

  constructor(
    private dialog: MatDialog,
    private backend: DataService
  ) { }

  openDialog(vsws?: VehicleSteelWeighingSurvey) {
    console.log('opening vswsDialog with data:');
    console.log(vsws);
    const prepareVSWS = (vsws?: VehicleSteelWeighingSurvey) => {
      if (!vsws) {
        return of(new VehicleSteelWeighingSurvey());
      } else {
        // show 'loading...' before data is ready
        const loadingDialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true
        });
        // get the customer details
        return this.backend.dataCustomers.search({ _id: vsws.weighing.customerId })
          .pipe(
            map((customers: Customer[]) => {
              if ((customers as Customer[]).length) {
                const customerX = customers[0];
                vsws.weighing.customerName = customerX.name;
                vsws.weighing.customerTel = customerX.mobile;
              }
              loadingDialogRef.close();
              return vsws;
            })
          )
        // return of(vsws);
      }
    }
    prepareVSWS(vsws).pipe(first()).subscribe(vswsX => {
      const dialogRef = this.dialog.open(VehicleSteelWeighingSurveyDialogComponent, {
        disableClose: true,
        data: { vsws: vswsX }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    })
  }
}
