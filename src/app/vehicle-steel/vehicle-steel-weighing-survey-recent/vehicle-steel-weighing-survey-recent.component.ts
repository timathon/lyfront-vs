import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "@app/shared/services/data.service";
import { VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { Observable } from 'rxjs';

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
    private backend: DataService
  ) {
    // this.vswsRecentList$ = this.backend.dataVS.getRecent();

   }

  ngOnInit(): void {
  }

}
