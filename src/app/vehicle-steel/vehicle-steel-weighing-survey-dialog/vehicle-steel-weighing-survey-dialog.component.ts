import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { Observable, of, Subscription } from 'rxjs';
import { DataService } from '@app/shared/services/data.service';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Customer } from '@app/shared/services/data/data-customers';
import { CustomerDialogServiceService } from '@app/customers/customer-dialog/customer-dialog-service.service';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-vehicle-steel-weighing-survey-dialog',
  templateUrl: './vehicle-steel-weighing-survey-dialog.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-dialog.component.scss']
})
export class VehicleSteelWeighingSurveyDialogComponent implements OnInit {
  vswsForm: FormGroup;
  materialsFormArray: FormArray;
  dialogTitle: string;
  truckPlateNoOptions: string[] = ['辽N'];
  subscriptions_: Subscription[] = [];
  possibleCustomers$?: Observable<Customer[]> = of([]);
  loadingPossibleCustomers = false;
  disableEditCustomerButton = true;
  customer: Customer = {
    name: ''
  };
  selectedPws: any[] = [];
  status = {
    showNewCustomerButton: false,
    observables: {
      valueChanges: of(null)
    },
    netWeightKG: 0,
    lastValue: new VehicleSteelWeighingSurvey()
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey, pws: any[] },
    private fb: FormBuilder,
    private backend: DataService,
    public customerDialog: CustomerDialogServiceService,
    private auth: AuthService
  ) {
    this.selectedPws = this.data.pws.filter(pw => pw.name.indexOf('废钢')> -1 && pw.name.indexOf('公斤')> -1 );
    console.log(this.selectedPws);
    console.log(this.data.vsws);
    this.status.lastValue = this.data.vsws;
    this.status.netWeightKG = this.data.vsws.weighing.outWeightKG && this.data.vsws.weighing.inWeightKG ?
      this.data.vsws.weighing.outWeightKG - this.data.vsws.weighing.inWeightKG :
      0;
    if (this.data.vsws.survey && this.data.vsws.survey.materials.length) {
      this.materialsFormArray = this.fb.array(this.data.vsws.survey.materials?.map(material => this.fb.group({
        _id: material._id,
        pws: material.pws,
        weightKG: material.weightKG,
        count: material.count,
        cost: material.cost,
        notes: material.notes
      })));
    } else {
      this.materialsFormArray = this.fb.array([]);
    }
    this.vswsForm = this.fb.group({
      _id: [this.data.vsws._id],
      weighing: this.fb.group({
        truckPlateNo: [{
          value: this.data.vsws.weighing.truckPlateNo, disabled: !!this.data.vsws.weighing.truckPlateNo
        }, [Validators.required, Validators.minLength(7)]],
        customerId: this.data.vsws.weighing.customerId,
        customerName: [{
          value: this.data.vsws.weighing.customerName, disabled: !!this.data.vsws.weighing.customerName
        }, Validators.required],
        customerTel: [{
          value: this.data.vsws.weighing.customerTel, disabled: true
        }],
        inWeightKG: [{
          value: this.data.vsws.weighing.inWeightKG, disabled: false
        }],
        inWeighedDate: this.data.vsws.weighing.inWeighedAt ? (this.data.vsws.weighing.inWeighedAt).toISOString().substring(0, 10) : '',
        inWeighedTime: this.data.vsws.weighing.inWeighedAt ? (this.data.vsws.weighing.inWeighedAt).toTimeString().substring(0, 5) : '',
        inWeighedBy: this.data.vsws.weighing.inWeighedBy,
        inWeighedByName: [{
          value: this.data.vsws.weighing.inWeighedByName,
          disabled: true
        }],
        outWeightKG: [{
          value: this.data.vsws.weighing.outWeightKG, disabled: false
        }],
        outWeighedDate: this.data.vsws.weighing.outWeighedAt ? (this.data.vsws.weighing.outWeighedAt).toISOString().substring(0, 10) : '',
        outWeighedTime: this.data.vsws.weighing.outWeighedAt ? (this.data.vsws.weighing.outWeighedAt).toTimeString().substring(0, 5) : '',
        outWeighedBy: this.data.vsws.weighing.outWeighedBy,
        outWeighedByName: [{
          value: this.data.vsws.weighing.inWeighedByName,
          disabled: true
        }],
        notes: this.data.vsws.weighing.notes
      }),
      survey: this.fb.group({
        surveyedBy: this.data.vsws.survey.surveyedBy,
        surveyedByName: [{
          value: this.data.vsws.survey.surveyedByName,
          disabled: true
        }],
        surveyedDate: this.data.vsws.survey.surveyedAt ? (this.data.vsws.survey.surveyedAt).toISOString().substring(0, 10) : '',
        surveyedTime: this.data.vsws.survey.surveyedAt ? (this.data.vsws.survey.surveyedAt).toTimeString().substring(0, 5) : ''
        // surveyedBy?: any,
        // surveyedAt?: Date,
        // materials?: SurveyedMaterial[]
      })
    })
    this.dialogTitle = this.data.vsws._id ? '编辑进场物资' : '新建进场物资'
  }

  ngOnInit(): void {
    console.log(this.auth.getCurrentUser())
    this.status.observables.valueChanges = this.vswsForm.valueChanges
      .pipe(
        tap((value: any) => {
          // when inWeightKG changed from '' to number, set data time and inWeighedBy
          const initInWeightKG = this.status.lastValue.weighing.inWeightKG;
          const newInWeightKG = value.weighing.inWeightKG;
          if (!initInWeightKG && newInWeightKG) {
            const thatDate = new Date();
            this.vswsForm.patchValue({
              weighing: {
                inWeighedDate: thatDate.toISOString().substring(0, 10),
                inWeighedTime: thatDate.toTimeString().substring(0, 5),
                inWeighedBy: this.auth.getCurrentUser()?._id,
                inWeighedByName: this.auth.getCurrentUser()?.displayName,
              }
            }, { emitEvent: false });
          }
          const initOutWeightKG = this.status.lastValue.weighing.outWeightKG;
          const newOutWeightKG = value.weighing.outWeightKG;
          if (!initOutWeightKG && newOutWeightKG) {
            const thatDate = new Date();
            this.vswsForm.patchValue({
              weighing: {
                outWeighedDate: thatDate.toISOString().substring(0, 10),
                outWeighedTime: thatDate.toTimeString().substring(0, 5),
                outWeighedBy: this.auth.getCurrentUser()?._id,
                outWeighedByName: this.auth.getCurrentUser()?.displayName,
              }
            }, { emitEvent: false });
          }
          this.status.netWeightKG = newInWeightKG - newOutWeightKG;

          // if negative netWeightKG, add form error
          if (this.status.netWeightKG < 0) {
            this.vswsForm.setErrors({
              weightError: true
            })

          }
        })
      )
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
            this.status.showNewCustomerButton = !!this.vswsForm.get('weighing.customerName')?.dirty && (!combo.customerNameX || (!!combo.customerNameX && !foundMatchCustomer));
            this.disableEditCustomerButton = !combo.customerNameX;
            // console.log(possibleCustomers);
            // set customerTel
            if (foundMatchCustomer) {
              this.customer = foundMatchCustomer;
              this.vswsForm.get('weighing.customerTel')?.setValue(foundMatchCustomer?.mobile);
              this.vswsForm.get('weighing.customerId')?.setValue(foundMatchCustomer?._id);
              // this.vswsForm.get('weighing.customerName')?.setErrors(null); // angular form will reset error on any changes
            } else {
              this.vswsForm.get('weighing.customerName')?.setErrors({
                notFound: true
              });
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

  getMaterialControl(index: number, controlName: string) {
    return this.materialsFormArray.at(index).get(controlName) as FormControl;
  }

  addMaterial() {
    this.materialsFormArray.push(this.fb.group({
      pws: '',
      weightKG: 0,
      count: 0,
      cost: 0,
      notes: ''
    }))
  }

  removeMaterial(index: number) {
    this.materialsFormArray.removeAt(index);
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
