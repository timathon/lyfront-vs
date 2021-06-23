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
  @Input() isOutbound = false;
  // vswsRecentList$: Observable<VehicleSteelWeighingSurvey[]>
  displayedColumns: string[] = [];
  constructor(
    // private backend: DataService,
    public dialog: MatDialog,
    public vswsDialog: VehicleSteelWeighingSurveyDialogService

  ) {
    // this.vswsRecentList$ = this.backend.dataVS.getRecent();

  }

  ngOnInit(): void {
    this.displayedColumns = this.isOutbound ? [
      '_id', 'truckPlateNo', 'netWeight', 'operations', /* 'print' */
    ] : [
      '_id', 'truckPlateNo', 'netWeight', 'surveyDone', 'operations', /* 'print' */
    ]
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
        console.log({ editResult: result });
        // if changed, reload recent
      })
  }



  onPrint(item: VehicleSteelWeighingSurvey) {
    console.log('on printWeighing');
    this.vswsDialog.openDialog(item, 'printWeighing')
      .pipe(
        switchMap(dialogRef => {
          return dialogRef.afterClosed();
        })
      )
      .subscribe(result => {
        console.log({ editResult: result });
        // if changed, reload recent
      })
  }

  getNetWeight(item: VehicleSteelWeighingSurvey) {
      return item.isOutbound ? (
        (item.weighing?.inWeightKG && item.weighing?.outWeightKG) ?
        (item.weighing?.outWeightKG - item.weighing?.inWeightKG) :
        0
      ) : (
        (item.weighing?.inWeightKG && item.weighing?.outWeightKG) ?
        (item.weighing?.inWeightKG - item.weighing?.outWeightKG) :
        0
      );
      
      
  }

  onPrintB(item: VehicleSteelWeighingSurvey) {
    // printing inventory entry receipt
    console.log('on printSurvey');
    this.vswsDialog.openDialog(item, 'printSurvey')
      .pipe(
        switchMap(dialogRef => {
          return dialogRef.afterClosed();
        })
      )
      .subscribe(result => {
        console.log({ editResult: result });
        // if changed, reload recent
      })
  }


}
