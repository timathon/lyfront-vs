import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { UtilsService } from '@app/shared/services/utils.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-vehicle-steel-weighing-print',
  templateUrl: './vehicle-steel-weighing-print.component.html',
  styleUrls: ['./vehicle-steel-weighing-print.component.scss']
})
export class VehicleSteelWeighingPrintComponent implements OnInit, OnDestroy {
  paddingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey, pws: any[], changesSaved$$: Subject<any> },
    public utils: UtilsService,
    private dialogRef: MatDialogRef<VehicleSteelWeighingPrintComponent>,

    ) { 
      const paddingCache = localStorage.getItem('paddingCache') ? 
        JSON.parse(localStorage.getItem('paddingCache') as string) :
        {
          top: 0, bottom: 0, left: 0, right: 0
        };
      this.paddingForm = this.fb.group(paddingCache);
    }

  ngOnInit(): void {
    console.log(this.data);
  }

  ngOnDestroy() {
    if (this.paddingForm.dirty) {
      console.log('changed');
      localStorage.setItem('paddingCache', JSON.stringify(this.paddingForm.getRawValue()));
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get padding() {
    const paddingObj = this.paddingForm.getRawValue();
    return `${paddingObj.top}px ${paddingObj.right}px ${paddingObj.bottom}px ${paddingObj.left}px`;
  }


}
