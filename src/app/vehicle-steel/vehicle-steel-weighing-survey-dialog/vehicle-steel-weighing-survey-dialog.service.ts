import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';
import { AuthService } from '@app/shared/services/auth.service';
import { DataService } from '@app/shared/services/data.service';
import { Customer } from '@app/shared/services/data/data-customers';
import { User } from '@app/shared/services/data/data-users';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { forkJoin, of, Subject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { VehicleSteelWeighingSurveyDialogComponent } from './vehicle-steel-weighing-survey-dialog.component';


@Injectable()
export class VehicleSteelWeighingSurveyDialogService {
  public changesSaved$$ = new Subject();
  constructor(
    private dialog: MatDialog,
    private backend: DataService,
    private auth: AuthService
  ) { }

  openDialog(vsws?: VehicleSteelWeighingSurvey) {
    console.log('opening vswsDialog with data:');
    console.log(vsws);
    const prepareVSWS = (vsws?: VehicleSteelWeighingSurvey) => {
      if (!vsws) {
        const currUser = this.auth.getCurrentUser();
        const newVSWS = new VehicleSteelWeighingSurvey();
        newVSWS.weighing.inWeighedBy = currUser?._id;
        newVSWS.weighing.inWeighedByName = currUser?.displayName;
        return of(newVSWS);
      } else {
        // show 'loading...' before data is ready
        const loadingDialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true
        });
        const getDetails = forkJoin({
          customer: vsws.weighing.customerId ? this.backend.dataCustomers.search({ _id: vsws.weighing.customerId }).pipe(
            map((customers: Customer[]) => {
              if (customers.length) {
                return customers[0];
              } else {
                return null;
              }
            })
          ) : of(null),
          inWeighedBy: vsws.weighing.inWeighedBy ? this.backend.dataUsers.search({ _id: vsws.weighing.inWeighedBy }).pipe(
            map((users: User[]) => {
              console.log(users);
              if (users.length) {
                return users[0];
              } else {
                return null;
              }
            })
          ) : of(null),
          outWeighedBy: vsws.weighing.outWeighedBy ? this.backend.dataUsers.search({ _id: vsws.weighing.outWeighedBy }).pipe(
            map((users: User[]) => {
              console.log(users);
              if (users.length) {
                return users[0];
              } else {
                return null;
              }
            })
          ) : of(null),
          surveyedBy: vsws.survey.surveyedBy ? this.backend.dataUsers.search({ _id: vsws.survey.surveyedBy }).pipe(
            map((users: User[]) => {
              console.log(users);
              if (users.length) {
                return users[0];
              } else {
                return null;
              }
            })
          ) : of(null)
        });
        // get the customer details
        return getDetails
          .pipe(
            map((result) => {
              if (result.customer) {
                vsws.weighing.customerName = result.customer.name;
                vsws.weighing.customerTel = result.customer.mobile;
              }
              if (result.inWeighedBy) {
                vsws.weighing.inWeighedByName = result.inWeighedBy.displayName;
              }
              if (result.outWeighedBy) {
                vsws.weighing.outWeighedByName = result.outWeighedBy.displayName;
              }
              if (result.surveyedBy) {
                vsws.survey.surveyedByName = result.surveyedBy.displayName;
              }
              loadingDialogRef.close();
              return vsws;
            })
          )
        // return of(vsws);
      }
    }
    return forkJoin({
      vsws: prepareVSWS(vsws),
      pws: this.backend.dataPws.getPws()
    })
      .pipe(
        first(),
        map(combo => {
          const dialogRef = this.dialog.open(VehicleSteelWeighingSurveyDialogComponent, {
            disableClose: true,
            data: {
              ...combo,
              changesSaved$$: this.changesSaved$$
            },
            // width: '50vw'
            backdropClass: 'full-width' // todo
          });
          return dialogRef;
        })
      )
  }
}
