import { Component, OnInit, Inject, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { DataService } from '@app/shared/services/data.service';
import { filter, first, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Customer } from '@app/shared/services/data/data-customers';
import { CustomerDialogServiceService } from '@app/customers/customer-dialog/customer-dialog-service.service';
import { AuthService } from '@app/shared/services/auth.service';
import { AlertService } from '@app/shared/services/alert/alert.service';
import { CalculatePatchesService } from '@app/shared/services/calculate-patches.service';

/* 

  vswsForm is built according to class VehicleSteelWeighingSurvey,
  however, the SurveyedMaterial array is a separate formArray.

*/
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
      valueChanges: of(null), // valueChanges for vswsForm
      valueChanges2: of(null), // valueChanges for materialsFormArray
    },
    netWeightKG: 0,
    lastValue: {
      outWeightKG: 0
    }
  }
  @ViewChildren('formRows') materialRows: QueryList<ElementRef> | undefined;
  objectTemplate = {
    _id: true,
    isDeleted: true,
    deletedAt: true,
    weighing: {
      truckPlateNo: true,
      customerId: true,
      inWeightKG: true,
      inWeighedAt: true,
      inWeighedBy: true,
      outWeightKG: true,
      outWeighedAt: true,
      outWeighedBy: true,
      notes: true
    },
    survey: {
      surveyedBy: true,
      surveyedAt: true
    }
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey, pws: any[], changesSaved$$: Subject<any> },
    private fb: FormBuilder,
    private backend: DataService,
    public customerDialog: CustomerDialogServiceService,
    private auth: AuthService,
    private alert: AlertService,
    private calculatePatches: CalculatePatchesService,
    private dialogRef: MatDialogRef<VehicleSteelWeighingSurveyDialogComponent>,
  ) {
    this.selectedPws = this.data.pws.filter(pw => pw.name.indexOf('废钢') > -1 && pw.name.indexOf('公斤') > -1);
    console.log(this.selectedPws);
    console.log(this.data.vsws);
    this.status.lastValue.outWeightKG = this.data.vsws.weighing.outWeightKG;
    this.status.netWeightKG = this.data.vsws.weighing.outWeightKG && this.data.vsws.weighing.inWeightKG ?
      this.data.vsws.weighing.outWeightKG - this.data.vsws.weighing.inWeightKG :
      0;
    if (this.data.vsws.survey.materials && this.data.vsws.survey.materials.length) {
      this.materialsFormArray = this.fb.array(this.data.vsws.survey.materials?.map(material => this.fb.group({
        _id: material._id,
        pw: [{ value: material.pw, disabled: true }],
        weightKG: material.weightKG,
        count: material.count,
        cost: material.cost,
        notes: material.notes
      })));
    } else {
      this.materialsFormArray = this.fb.array([]);
    }
    this.vswsForm = this.fb.group({
      _id: this.data.vsws._id,
      isDeleted: this.data.vsws.isDeleted,
      deletedAt: this.data.vsws.deletedAt,
      deletedBy: this.data.vsws.deletedBy,
      deletedNotes: this.data.vsws.deletedNotes,
      weighing: this.fb.group({
        truckPlateNo: [{
          value: this.data.vsws.weighing.truckPlateNo, disabled: !!this.data.vsws.weighing.truckPlateNo
        }, [Validators.required, Validators.minLength(7)]],
        customerId: this.data.vsws.weighing.customerId,
        customerName: [{
          value: this.data.vsws.weighing.customerName, disabled: !!this.data.vsws.weighing.customerName
        }],
        customerTel: [{
          value: this.data.vsws.weighing.customerTel, disabled: true
        }],
        inWeightKG: [{
          value: this.data.vsws.weighing.inWeightKG, disabled: false
        }],
        inWeighedDate: this.data.vsws.weighing.inWeighedAt ? (new Date(this.data.vsws.weighing.inWeighedAt)).toLocaleDateString().split('/').map(item => item.padStart(2, '0')).join('-') : '',
        inWeighedTime: this.data.vsws.weighing.inWeighedAt ? (new Date(this.data.vsws.weighing.inWeighedAt)).toTimeString().substring(0, 5) : '',
        inWeighedBy: this.data.vsws.weighing.inWeighedBy,
        inWeighedByName: [{
          value: this.data.vsws.weighing.inWeighedByName,
          disabled: true
        }],
        outWeightKG: [{
          value: this.data.vsws.weighing.outWeightKG, disabled: false
        }],
        outWeighedDate: this.data.vsws.weighing.outWeighedAt ? (new Date(this.data.vsws.weighing.outWeighedAt)).toISOString().substring(0, 10) : '',
        outWeighedTime: this.data.vsws.weighing.outWeighedAt ? (new Date(this.data.vsws.weighing.outWeighedAt)).toTimeString().substring(0, 5) : '',
        outWeighedBy: this.data.vsws.weighing.outWeighedBy,
        outWeighedByName: [{
          value: this.data.vsws.weighing.outWeighedByName,
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
        surveyedDate: [{
          value: this.data.vsws.survey.surveyedAt ? (this.data.vsws.survey.surveyedAt).toISOString().substring(0, 10) : '',
          disabled: !!this.data.vsws.survey.surveyedAt
        }],
        surveyedTime: [{
          value: this.data.vsws.survey.surveyedAt ? (this.data.vsws.survey.surveyedAt).toTimeString().substring(0, 5) : '',
          disabled: !!this.data.vsws.survey.surveyedAt
        }]
        // surveyedBy?: any,
        // surveyedAt?: Date,
        // materials?: SurveyedMaterial[]
      })
    })

    this.dialogTitle = this.data.vsws._id ? '编辑进场物资' : '新建进场物资'
  }

  ngOnInit(): void {
    // console.log(this.auth.getCurrentUser())
    this.status.observables.valueChanges2 = this.materialsFormArray.valueChanges
      .pipe(
        startWith(this.materialsFormArray.getRawValue()),
        tap(value => {
          console.log({
            materialsFormArrayValue: value
          });

          const materialsFormValue = this.materialsFormArray.getRawValue();
          materialsFormValue.forEach((materialX, index) => {
            // check if pwName includes 发动机
            const pwFound = this.selectedPws.find(pw => pw._id === materialX.pw);
            if (pwFound && pwFound.name.indexOf('发动机') > -1) {
              // console.log(index, '发动机')
              this.materialsFormArray.controls[index].get('count')?.enable({ emitEvent: false });
            } else {
              this.materialsFormArray.controls[index].get('count')?.disable({ emitEvent: false });
            }
          })
        })
      )
    this.status.observables.valueChanges = this.vswsForm.valueChanges
      .pipe(
        tap((value: any) => {
          // when inWeightKG changed from '' to number, set data time and inWeighedBy
          // const initInWeightKG = this.status.lastValue.weighing.inWeightKG;
          const newInWeightKG = value.weighing.inWeightKG;
          // if (!initInWeightKG && newInWeightKG) {
          //   const thatDate = new Date();
          //   this.vswsForm.patchValue({
          //     weighing: {
          //       inWeighedDate: thatDate.toISOString().substring(0, 10),
          //       inWeighedTime: thatDate.toTimeString().substring(0, 5),
          //       inWeighedBy: this.auth.getCurrentUser()?._id,
          //       inWeighedByName: this.auth.getCurrentUser()?.displayName,
          //     }
          //   }, { emitEvent: false });
          // }
          // console.log({user: this.auth.getCurrentUser()})
          const initOutWeightKG = this.status.lastValue.outWeightKG;
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
            this.status.lastValue.outWeightKG = newOutWeightKG;
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
            this.vswsForm.patchValue({
              weighing: {
                customerTel: foundMatchCustomer?.mobile,
                customerId: foundMatchCustomer?._id,
              }
            })
            // this.vswsForm.get('weighing.customerTel')?.setValue(foundMatchCustomer?.mobile);
            // this.vswsForm.get('weighing.customerId')?.setValue(foundMatchCustomer?._id);
            // this.vswsForm.get('weighing.customerName')?.setErrors(null); // angular form will reset error on any changes
          } else {
            if (this.vswsForm.get('weighing.customerName')?.value) {
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
          }
          this.loadingPossibleCustomers = false;
        }),
        map((combo) => combo.possibleCustomers)
      )

  }

  getMaterialControl(index: number, controlName: string) {
    return this.materialsFormArray.at(index).get(controlName) as FormControl;
  }

  addMaterial() {

    // set surveyedBy, if it's the first material to be added
    if (!this.materialsFormArray.controls.length) {
      const thatDate = new Date();
      this.vswsForm.patchValue({
        survey: {
          surveyedBy: this.auth.getCurrentUser()?._id,
          surveyedByName: this.auth.getCurrentUser()?.displayName,
          surveyedDate: thatDate.toISOString().substring(0, 10),
          surveyedTime: thatDate.toTimeString().substring(0, 5)
        }
      })
    }
    if (this.materialsFormArray.controls.length < 5) {
      const newFormItem = this.fb.group({
        pw: ['', Validators.required],
        weightKG: [0, Validators.min(0.1)],
        count: [{ value: 0, disabled: true }],
        cost: 0,
        notes: ''
      });
      this.materialsFormArray.push(newFormItem);
      setTimeout(() => {
        this.materialRows?.last.nativeElement.scrollIntoView();
        this.materialRows?.last.nativeElement.querySelector('mat-select').click()
      }, 0)
    } else {
      // alert to prevent adding the 11th material
      this.alert.openDialog({
        title: '出错了',
        message: '单车最多5种物资',
        okOnly: true
      })
    }
  }

  removeMaterial(index: number) {
    this.materialsFormArray.removeAt(index);

    // clear surveyedBy, if 0 material
    if (!this.materialsFormArray.controls.length) {
      this.vswsForm.patchValue({
        survey: {
          surveyedBy: '',
          surveyedByName: '',
          surveyedDate: '',
          surveyedTime: ''
        }
      })
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

  preparePatches() {
    const newObject = this.vswsForm.getRawValue();
    const oldObject = this.data.vsws;

    // prepareData
    if (newObject.weighing.inWeighedDate && newObject.weighing.inWeighedTime) {
      newObject.weighing.inWeighedAt = (new Date(newObject.weighing.inWeighedDate + ' ' + newObject.weighing.inWeighedTime)).toISOString();
    }
    if (newObject.weighing.outWeighedDate && newObject.weighing.outWeighedTime) {
      newObject.weighing.outWeighedAt = (new Date(newObject.weighing.outWeighedDate + ' ' + newObject.weighing.outWeighedTime)).toISOString();
    }
    if (newObject.survey.surveyedDate && newObject.survey.surveyedTime) {
      newObject.survey.surveyedAt = (new Date(newObject.survey.surveyedDate + ' ' + newObject.survey.surveyedTime)).toISOString();
    }
    const vswsPatches = this.calculatePatches.calculatePatches({
      oldObject,
      newObject,
      objectTemplate: this.objectTemplate
    });

    return {
      vswsPatches,
      newObject,
      oldObject
    };

  }

  onCancel() {
    const patches = this.preparePatches().vswsPatches;
    if (patches.length) {
      // alert changed
      const alertDialogRef = this.alert.openDialog({
        title: '内容已变更',
        message: '是否放弃更改？'
      });
      alertDialogRef.afterClosed().pipe(
        first()
      ).subscribe(alertConfirmed => {
        if (alertConfirmed) {
          // confirm discarding the changes
          this.dialogRef.close();
        } // else do nothing, go on editing
      })
    } else {
      console.log('no change');
      this.dialogRef.close();
    }
  }

  onSubmit() {
    const {newObject, oldObject, vswsPatches} = this.preparePatches();

    console.log({
      old: oldObject,
      new: newObject,
    })

    if (oldObject._id) {
      // patch object
      console.log(vswsPatches);
      if (!vswsPatches.length) {
        this.alert.openDialog({
          title: '无变动',
          message: '内容没有任何变动，无需保存',
          okOnly: true
        })
      } else {
        this.backend.dataVS.update({
          _id: oldObject._id,
          vswsPatches: vswsPatches
        }).pipe(
          first()
        )
        .subscribe(res => {
          console.log({
            vswsPatchResult: res
          });
          // close dialog, update recent
          this.dialogRef.close({
            changesSaved: true
          });
          this.data.changesSaved$$.next();
        })
      }
    } else {
      // create object
      this.backend.dataVS.insert(this.calculatePatches.trimObject(newObject, this.objectTemplate) as VehicleSteelWeighingSurvey)
        .pipe(
          first()
        )
        .subscribe(res => {
          console.log({ res });
          this.data.changesSaved$$.next();

          // colse dialog
          // refresh recent
        })
    }

  }


}
