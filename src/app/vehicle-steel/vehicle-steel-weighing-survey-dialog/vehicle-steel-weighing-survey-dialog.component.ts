import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';

@Component({
  selector: 'app-vehicle-steel-weighing-survey-dialog',
  templateUrl: './vehicle-steel-weighing-survey-dialog.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-dialog.component.scss']
})
export class VehicleSteelWeighingSurveyDialogComponent implements OnInit {
  vswsForm: FormGroup;
  dialogTitle: string;
  truckPlateNoOptions: string[] = ['辽N'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey },
    private fb: FormBuilder
  ) { 
    this.vswsForm = this.fb.group({
      id: [this.data.vsws.id],
      truckPlateNo: [this.data.vsws.truckPlateNo],
      grossWeight: [this.data.vsws.grossWeight]
    })
    this.dialogTitle = this.data.vsws.id? '编辑进场物资' : '新建进场物资'
  }

  ngOnInit(): void {
    console.log(this.data);

  }

}
