import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from "@app/shared/services/data.service";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { VehicleSteelWeighingSurveyDialogService } from '@app/vehicle-steel/vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.service';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';

@Component({
  selector: 'app-vehicle-steel-weighing-survey',
  templateUrl: './vehicle-steel-weighing-survey.component.html',
  styleUrls: ['./vehicle-steel-weighing-survey.component.scss']
})
export class VehicleSteelWeighingSurveyComponent implements OnInit {
  public vswsRecentList$?: Observable<any>
  filterSurveyDone$$ = new BehaviorSubject(false);

  constructor(
    private backend: DataService,
    private dialog: MatDialog,
    public vswsDialog: VehicleSteelWeighingSurveyDialogService
  ) { }

  ngOnInit(): void {
    const loadingDialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      data: {
        message: '正在载入近期废钢进场记录...'
      }
    });
    this.vswsRecentList$ = this.vswsDialog.changesSaved$$.pipe(
      startWith(null),
      switchMap(() => {
        return this.backend.dataVS.getRecent()
      }),
      switchMap((vswsRecentList) => {
        return this.filterSurveyDone$$
          .pipe(
            map((showOnlySurveyNotDone) => {
              return showOnlySurveyNotDone ? vswsRecentList.filter(item => !!item.survey.surveyedAt === false) : vswsRecentList
            }),
            tap(() => {
              loadingDialogRef.close();
            })
          )

      })
    )
    
  }

}

