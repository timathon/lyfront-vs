import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleSteelWeighingSurveyDialogComponent } from '../vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.component';
import { DataService } from "@app/shared/services/data.service";
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-steel-weighing-survey',
  templateUrl: './vehicle-steel-weighing-survey.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey.component.scss']
})
export class VehicleSteelWeighingSurveyComponent implements OnInit {
  public vswsRecentList$?: Observable<any>
  filterSurveyDone$$ = new BehaviorSubject(false);

  constructor(
    public dialog: MatDialog,
    private backend: DataService
  ) { }

  ngOnInit(): void {
    this.vswsRecentList$ = this.backend.dataVS.getRecent()
      .pipe(switchMap((vswsRecentList) => {
        return this.filterSurveyDone$$
          .pipe(
            map((showOnlySurveyNotDone) => {
              return showOnlySurveyNotDone ? vswsRecentList.filter(item => item.surveyDone === false) : vswsRecentList
            })
          )
                
      }))
  }

  openDialog(vsws?: any) {
    const dialogRef = this.dialog.open(VehicleSteelWeighingSurveyDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}

