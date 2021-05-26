import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { LoadingComponent } from '@app/shared/components/loading/loading.component';
// import { DataService } from '@app/shared/services/data.service';
import { Customer } from '@app/shared/services/data/data-customers';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { CustomerDialogComponent } from './customer-dialog.component';

@Injectable()
export class CustomerDialogServiceService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openDialog(customer?: Customer) {
    console.log('opening cutomerDialog with data:');
    console.log(customer);
    // const prepareData = (customer?: Customer) => {
    //   if (!customer) {
    //     return of(new Customer());
    //   } else {
    //     return of(customer);
    //   }
    // }
    // prepareData(customer).pipe(first()).subscribe(customerX => {
    //   const dialogRef = this.dialog.open(CustomerDialogComponent, {
    //     disableClose: true,
    //     data: { customer: customerX }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(`Dialog result: ${result}`);
    //   });
    // })
    return this.dialog.open(CustomerDialogComponent, {
      disableClose: true,
      data: { customer }
    });

  }
}
