import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '@app/shared/services/data/data-customers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { UtilsService } from '@app/shared/services/utils.service';
import { DataService } from '@app/shared/services/data.service';
import { AlertService } from '@app/shared/services/alert/alert.service';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  formX: FormGroup;
  dialogTitle: string;
  status$: Observable<any> = of();
  status = {
    changed: false
  };
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer },
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    private utils: UtilsService,
    private backend: DataService,
    private alert: AlertService
  ) { 

    this.dialogTitle = this.data.customer._id ? '编辑客户' : '新建客户'
    this.formX = this.fb.group({
      _id: [this.data.customer._id],
      name: [{value: this.data.customer.name, disabled: !!this.data.customer._id}, Validators.required],
      mobile: [this.data.customer.mobile, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      notes: [this.data.customer.notes]
    })
  }

  ngOnInit(): void {
    this.status$ = this.formX.valueChanges
      .pipe(
        tap(value => {
          // this.status.changed = (value.name === this.data.customer.name) || () || ()
          // console.log(value);
          this.status.changed = !this.utils.compareObjects(this.formX.getRawValue(), this.data.customer, [
            'name', 'mobile', 'notes'
          ]);
          console.log('status', this.status)
        })
      )
  }

  onSubmit() {
    console.log('at onSubmit');
    // save to server
    const newCustomer = this.formX.getRawValue();
    const oldCustomer = this.data.customer ;
    this.backend.dataCustomers.save({
      newCustomer,
      oldCustomer
    }).pipe(
      first(),
      catchError(error => of(error))
    ).subscribe(res => {
      console.log(res);
      if (res.collection_upsert || res._id) {
        if (oldCustomer._id) {
          // patching old customer
          this.dialogRef.close(newCustomer);
        } else {
          // creating new customer
          this.dialogRef.close(res);
        }
      } else {
        console.log('got error');
        console.log(res);
      }
    })
  }

  onCancel() {
    console.log('at onCancel');
    if (this.status.changed) {
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
        }
      })
    } else {
      console.log('no change');
      this.dialogRef.close();
    }
  }

}
