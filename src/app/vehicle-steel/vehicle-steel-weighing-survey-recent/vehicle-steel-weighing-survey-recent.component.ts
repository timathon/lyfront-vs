import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { VehicleSteelWeighingSurveyDialogService } from '@app/vehicle-steel/vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-vehicle-steel-weighing-survey-recent',
  templateUrl: './vehicle-steel-weighing-survey-recent.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey-recent.component.scss']
})
export class VehicleSteelWeighingSurveyRecentComponent implements OnInit {
  @Input() vswsRecentList: VehicleSteelWeighingSurvey[] = [];
  // vswsRecentList$: Observable<VehicleSteelWeighingSurvey[]>
  displayedColumns: string[] = [
    '_id', 'truckPlateNo', /* 'grossWeight',  */'surveyDone', 'edit'
  ];
  constructor(
    // private backend: DataService,
    public dialog: MatDialog,
    public vswsDialog: VehicleSteelWeighingSurveyDialogService

  ) {
    // this.vswsRecentList$ = this.backend.dataVS.getRecent();

   }

  ngOnInit(): void {
  }

  onEdit(item: any) {
    console.log('on edit');
    this.vswsDialog.openDialog(item)
      .pipe(
        switchMap(dialogRef => {
          return dialogRef.afterClosed();
        })
      )
      .subscribe(result => {
        console.log({editResult: result});
        // if changed, reload recent
      })
  }




}
