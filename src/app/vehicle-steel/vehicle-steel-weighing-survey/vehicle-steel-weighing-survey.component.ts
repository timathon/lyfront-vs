import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from "@app/shared/services/data.service";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VehicleSteelWeighingSurveyDialogService } from '@app/vehicle-steel/vehicle-steel-weighing-survey-dialog/vehicle-steel-weighing-survey-dialog.service';

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
    public vswsDialog: VehicleSteelWeighingSurveyDialogService
  ) { }

  ngOnInit(): void {
    this.vswsRecentList$ = this.backend.dataVS.getRecent()
      .pipe(switchMap((vswsRecentList) => {
        return this.filterSurveyDone$$
          .pipe(
            map((showOnlySurveyNotDone) => {
              return showOnlySurveyNotDone ? vswsRecentList.filter(item => !!item.survey.surveyedAt === false) : vswsRecentList
            })
          )

      }))
  }

}

