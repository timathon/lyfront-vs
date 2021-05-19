import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


export class DataVehicleSteel {
  weighingSurveyEntries: VehicleSteelWeighingSurvey[] = [
    {
      id: 1,
      truckPlateNo: '辽N12121',
      grossWeight: 1000,
      surveyDone: true
    },
    {
      id: 2,
      truckPlateNo: '辽N90909',
      grossWeight: 2000,
      surveyDone: false
    }
  ];
  constructor(private http: HttpClient) {

  }

  getRecent(): Observable<VehicleSteelWeighingSurvey[]> {
    return of(this.weighingSurveyEntries);
  }


}

export interface VehicleSteelWeighingSurvey {
  id?: any;
  truckPlateNo: string;
  grossWeight: number;
  wDate?: Date;
  sDate?: Date;
  surveyDone: boolean;
}
