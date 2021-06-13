import { Component, OnInit, Inject, ViewChildren, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { LoadingComponent } from '@app/shared/components/loading/loading.component';

/* 

  vswsForm is built according to class VehicleSteelWeighingSurvey,
  however, the SurveyedMaterial array is a separate formArray.

*/
@Component({
  selector: 'app-vehicle-steel-weighing-survey-dialog',
  templateUrl: './vehicle-steel-weighing-survey-dialog.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-dialog.component.scss']
})
export class VehicleSteelWeighingSurveyDialogComponent implements OnInit, OnDestroy {
  sub0_: Subscription | undefined;
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
    },
    netWeightKG: 0,
    materialTotalWeight: 0,
    materialTotalCost: 0,
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
      surveyedAt: true,
      materials: true
    }
  };

  totalMaterialWeightGreaterThanWeighingNetweight = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey, pws: any[], changesSaved$$: Subject<any> },
    private fb: FormBuilder,
    private backend: DataService,
    public customerDialog: CustomerDialogServiceService,
    private auth: AuthService,
    private alert: AlertService,
    private calculatePatches: CalculatePatchesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VehicleSteelWeighingSurveyDialogComponent>,
  ) {
    const currUser = this.auth.getCurrentUser();
    this.selectedPws = this.data.pws.filter(pw => pw.name.indexOf('废钢') > -1 && pw.name.indexOf('公斤') > -1);
    console.log(this.selectedPws);
    console.log(this.data.vsws);
    this.status.lastValue.outWeightKG = this.data.vsws.weighing.outWeightKG;
    this.status.netWeightKG = this.data.vsws.weighing.outWeightKG && this.data.vsws.weighing.inWeightKG ?
      this.data.vsws.weighing.outWeightKG - this.data.vsws.weighing.inWeightKG :
      0;
    if (this.data.vsws.survey.materials && this.data.vsws.survey.materials.length) {
      console.log(this.data.vsws.survey.materials)
      this.materialsFormArray = this.fb.array(this.data.vsws.survey.materials?.map(material => this.fb.group({
        // _id: material._id,
        pwId: [{ value: material.pwId, disabled: true }],
        weightKG: material.weightKG,
        count: material.count,
        price: material.price,
        // cost: [{value: (material.count || 0) * (material.price || 0), disabled: true}],
        notes: material.notes,
        inventoryId: material.inventoryId,
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
        inWeighedBy: this.data.vsws.weighing.inWeighedBy ? this.data.vsws.weighing.inWeighedBy : currUser?._id,
        inWeighedByName: [{
          value: this.data.vsws.weighing.inWeighedByName ? this.data.vsws.weighing.inWeighedByName : currUser?.displayName,
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
          value: this.data.vsws.survey.surveyedAt ? (new Date(this.data.vsws.survey.surveyedAt)).toISOString().substring(0, 10) : '',
          disabled: !!this.data.vsws.survey.surveyedAt
        }],
        surveyedTime: [{
          value: this.data.vsws.survey.surveyedAt ? (new Date(this.data.vsws.survey.surveyedAt)).toTimeString().substring(0, 5) : '',
          disabled: !!this.data.vsws.survey.surveyedAt
        }],
        materials: this.materialsFormArray
        // surveyedBy?: any,
        // surveyedAt?: Date,
        // materials?: SurveyedMaterial[]
      })
    })

    this.dialogTitle = this.data.vsws._id ? '编辑进场物资' : '新建进场物资'
  }

  ngOnDestroy() {
    this.sub0_?.unsubscribe()
  }

  ngOnInit(): void {
    // console.log(this.auth.getCurrentUser())

    this.status.observables.valueChanges = this.vswsForm.valueChanges
      .pipe(
        startWith(this.vswsForm.getRawValue()),
        tap((value: any) => {
          const materialsFormValue: any[] = (value as any).survey.materials;

          console.log({
            value
          });
          materialsFormValue.forEach((materialX, index) => {
            // check if pwName includes 发动机
            // const pwFound = this.selectedPws.find(pw => pw._id === materialX.pwId);
            // if (pwFound && pwFound.name.indexOf('发动机') > -1) {
            //   this.materialsFormArray.controls[index].get('count')?.enable({ emitEvent: false });
            // } else {
            //   if (pwFound) {
            //     this.materialsFormArray.controls[index].get('count')?.disable({ emitEvent: false });
            //   }
            // }


            
          })



          setTimeout(() => {
            this.status.materialTotalCost = materialsFormValue.reduce((acc, curr) => {
              return acc + curr.price * curr.weightKG
            }, 0);
            this.status.materialTotalWeight = materialsFormValue.reduce((acc, curr) => {
              // console.log(curr.weightKG * 1)
              return acc + curr.weightKG * 1;
            }, 0);

            // when inWeightKG changed from '' to number, set data time and inWeighedBy
            // const initInWeightKG = this.status.lastValue.weighing.inWeightKG;
            const newInWeightKG = value.weighing.inWeightKG;
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
            this.status.netWeightKG = (newInWeightKG && newOutWeightKG) ? (newInWeightKG - newOutWeightKG) : 0;

            // if negative netWeightKG, add form error
            if (this.status.netWeightKG < 0) {
              this.vswsForm.setErrors({
                weightError: true
              })

            }



            if (this.status.materialTotalWeight > this.status.netWeightKG) {
              this.totalMaterialWeightGreaterThanWeighingNetweight = true;
              // 暂时允许“物资总重”大于“过磅净重”；当发生上述情况时，警告但不报错。
              // this.vswsForm.setErrors(Object.assign({}, this.vswsForm.errors, {
              //   weightError2: 'material total weight cannot be greater than netWeightKG'
              // }))
            } else {
              this.totalMaterialWeightGreaterThanWeighingNetweight = false;
            }
          }, 0)

        })
      )

    this.sub0_ = this.status.observables.valueChanges.subscribe();
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
            }, {emitEvent: false})
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
        pwId: ['', Validators.required],
        weightKG: [0, Validators.min(0.1)],
        count: [{ value: 0, disabled: true }],
        price: 0,
        // cost: 0,
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
    // const newArray = this.materialsFormArray.getRawValue();
    // const oldArray = this.data.vsws.survey.materials ? this.data.vsws.survey.materials : [];

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

    // const martieralPatches = this.calculatePatches

    return {
      oldObject,
      newObject,
      vswsPatches,
      // oldArray,
      // newArray,
      // materialPatches
    };

  }

  onCancel() {
    const patches = this.preparePatches().vswsPatches;
    console.log({
      patches
    })
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

  onSubmit2() {
    const { newObject, oldObject, vswsPatches } = this.preparePatches();

    console.log({ newObject, oldObject, vswsPatches })

  }

  onSubmit() {
    const { newObject, oldObject, vswsPatches } = this.preparePatches();
    console.log({ newObject, oldObject, vswsPatches })

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
        const loadingDialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true,
          data: {
            message: '正在保存...'
          }
        });
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
            loadingDialogRef.close();
            // close dialog, update recent
            this.dialogRef.close();
            this.data.changesSaved$$.next();
          })
      }
    } else {
      // create object
      const loadingDialogRef2 = this.dialog.open(LoadingComponent, {
        disableClose: true,
        data: {
          message: '正在保存...'
        }
      });
      this.backend.dataVS.insert(this.calculatePatches.trimObject(newObject, this.objectTemplate) as VehicleSteelWeighingSurvey)
        .pipe(
          first()
        )
        .subscribe(res => {
          console.log({ res });
          loadingDialogRef2.close();
          this.data.changesSaved$$.next();
          this.dialogRef.close();
          // colse dialog
          // refresh recent
        })
    }

  }

  objectKeys(obj: {[key: string]: any}) {
    console.log({obj});
    // console.log({
    //   keys: Object.keys(obj)
    // });
  }


}
