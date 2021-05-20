import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataService } from "@app/shared/services/data.service";
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { VehicleSteelWeighingSurveyDialogComponent } from '../vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.component';

@Component({
  selector: 'app-vehicle-steel-weighing-survey-recent',
  templateUrl: './vehicle-steel-weighing-survey-recent.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-recent.component.scss']
})
export class VehicleSteelWeighingSurveyRecentComponent implements OnInit {
  @Input() vswsRecentList: VehicleSteelWeighingSurvey[] = [];
  // vswsRecentList$: Observable<VehicleSteelWeighingSurvey[]>
  displayedColumns: string[] = [
    'id', 'truckPlateNo', 'grossWeight', 'surveyDone', 'edit'
  ];
  constructor(
    // private backend: DataService,
    public dialog: MatDialog,
  ) {
    // this.vswsRecentList$ = this.backend.dataVS.getRecent();

   }

  ngOnInit(): void {
  }

  edit(vsws: VehicleSteelWeighingSurvey) {

    const dialogRef = this.dialog.open(VehicleSteelWeighingSurveyDialogComponent, {
      disableClose: true,
      data: {vsws}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
