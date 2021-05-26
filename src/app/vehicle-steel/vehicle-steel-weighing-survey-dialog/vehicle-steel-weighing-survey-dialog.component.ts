import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { Observable, of, Subscription } from 'rxjs';
import { DataService } from '@app/shared/services/data.service';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Customer } from '@app/shared/services/data/data-customers';
import { CustomerDialogServiceService } from '@app/customers/customer-dialog/customer-dialog-service.service';

@Component({
  selector: 'app-vehicle-steel-weighing-survey-dialog',
  templateUrl: './vehicle-steel-weighing-survey-dialog.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-dialog.component.scss']
})
export class VehicleSteelWeighingSurveyDialogComponent implements OnInit {
  vswsForm: FormGroup;
  dialogTitle: string;
  truckPlateNoOptions: string[] = ['辽N'];
  subscriptions_: Subscription[] = [];
  possibleCustomers$?: Observable<Customer[]> = of([]);
  showNewCustomerButton = false;
  loadingPossibleCustomers = false;
  disableEditCustomerButton = true;
  customer: Customer = {
    name: ''
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey },
    private fb: FormBuilder,
    private backend: DataService,
    public customerDialog: CustomerDialogServiceService
  ) {
    this.vswsForm = this.fb.group({
      _id: [this.data.vsws._id],
      weighing: this.fb.group({
        truckPlateNo: [{
          value: this.data.vsws.weighing.truckPlateNo, disabled: !!this.data.vsws.weighing.truckPlateNo
        }, Validators.required],
        customerId: this.data.vsws.weighing.customerId,
        customerName: [{
          value: this.data.vsws.weighing.customerName, disabled: !!this.data.vsws.weighing.customerName
        }, Validators.required],
        customerTel: [{
          value: this.data.vsws.weighing.customerTel, disabled: true
        }]
      }),
      // grossWeight: [this.data.vsws.grossWeight]
    })
    this.dialogTitle = this.data.vsws._id ? '编辑进场物资' : '新建进场物资'
  }

  ngOnInit(): void {
    if (!this.data.vsws._id) {
      // if create new vsws, when keying in customerName, find by regex and autoComplete
      this.possibleCustomers$ = this.vswsForm.get('weighing.customerName')?.valueChanges
        .pipe(
          startWith(this.vswsForm.get('weighing.customerName')?.value),
          switchMap(customerNameX => {
            this.loadingPossibleCustomers = true;
            if (!customerNameX) {
              return of([]).pipe(
                map(customers => ({ customerNameX, possibleCustomers: customers }))
              )
            } else {
              return this.backend.dataCustomers.search({ name: { $regex: `.*${customerNameX}.*` } }).pipe(
                map(customers => ({ customerNameX, possibleCustomers: customers }))
              )
            }
          }),
          tap((combo) => {
            console.log(combo);
            const foundMatchCustomer = combo.possibleCustomers.find(pC => pC.name === combo.customerNameX);
            this.showNewCustomerButton = !combo.customerNameX || (!!combo.customerNameX && !foundMatchCustomer);
            this.disableEditCustomerButton = !combo.customerNameX;
            // console.log(possibleCustomers);
            // set customerTel
            if (foundMatchCustomer) {
              this.customer = foundMatchCustomer;
              this.vswsForm.get('weighing.customerTel')?.setValue(foundMatchCustomer?.mobile);
              this.vswsForm.get('weighing.customerId')?.setValue(foundMatchCustomer?._id);
            } else {
              this.customer = {
                name: combo.customerNameX,
                mobile: ''
              };
              this.vswsForm.get('weighing.customerTel')?.setValue('');
              this.vswsForm.get('weighing.customerId')?.setValue('');
            }
            this.loadingPossibleCustomers = false;
          }),
          map((combo) => combo.possibleCustomers)
        )
    } else {
      this.possibleCustomers$ = of([]);
    }
  }

  openCustomerDialog(customer: Customer) {
    const dialogRef = this.customerDialog.openDialog(customer);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result._id) {
        this.vswsForm.get('weighing.customerId')?.setValue(result._id);
        this.vswsForm.get('weighing.customerName')?.setValue(result.name);
        this.vswsForm.get('weighing.customerTel')?.setValue(result.mobiel);
      }
    });
  }
}
