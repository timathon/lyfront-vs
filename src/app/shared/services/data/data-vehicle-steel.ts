import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VehicleSteelWeighing {
  truckPlateNo: string,
  customerId?: any,
  customerName?: string, // delete before patch
  customerTel?: string, // delete before patch
  inWeightKG: number,
  inWeighedAt?: Date,
  inWeighedBy?: any,
  inWeighedByName?: string,
  outWeightKG: number,
  outWeighedAt?: Date,
  outWeighedBy?: any,
  outWeighedByName?: any,
  notes?: string
}

export interface VehicleSteelSurvey {
  surveyedBy?: any;
  surveyedByName?: any;
  surveyedAt?: Date;
  materials: SurveyedMaterial[];
}

export class SurveyedMaterial {
  _id?: any;
  pw?: any;
  weightKG?: number;
  count?: number;
  cost?: number;
  notes?: string;
  inventoryId?: any;
  createdAt?: Date;
  createdBy?: any;
  modifiedAt?: Date;
  modifiedBy?: any;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: any;
  deleteNote?: string;
}

export class VehicleSteelWeighingSurvey {
  _id?: any = null;
  createdAt?: any = null;
  createdBy?: any = null;
  modifiedAt?: any = null;
  modifiedBy?: any = null;
  isDeleted?: any = false;
  deletedAt?: any = null;
  deletedBy?: any = null;
  deletedNotes?: any = null;
  weighing: VehicleSteelWeighing = {
    truckPlateNo: '',
    customerId: '',
    notes: '',
    inWeightKG: 0,
    inWeighedBy: '',
    inWeighedAt: new Date(),
    outWeightKG: 0,
    outWeighedBy: ''
  };
  survey: VehicleSteelSurvey = {
    surveyedBy: '',
    materials: []
  }
  changeLogs?: any[] = []; // delete before patch
  constructor(/* creatorUserId: any */) {
    // this.weighing.inWeighedBy = creatorUserId;
  }
}


export class DataVehicleSteel {
  apiURL = this.appConfig.backendUrl + '/api/vehicle-steel';


  constructor(
    private http: HttpClient,
    private setHeaders: (withJWT: boolean) => HttpHeaders | {
      [header: string]: string | string[];
    },
    private appConfig: any,
  ) {

  }

  getRecent(): Observable<VehicleSteelWeighingSurvey[]> {
    // get items 
    // 1) inWeighed within 7 days; 
    // 2) inWeighed 7 days earlier and survey not done

    const dateX = new Date();
    dateX.setDate(dateX.getDate() - 6);
    const dateBeginningX = new Date(dateX.toISOString().substr(0, 10));
    dateBeginningX.setHours(0); // 00hours of +8000
    const query1 = { createdAt: { $gte: new Date(dateBeginningX) } };
    const query2 = {
      createdAt: { $lt: new Date(dateBeginningX) },
      'survey.surveyedBy': ''
    };

    return forkJoin({
      within7days: this.search(query1),
      over7daysNotSurveyed: this.search(query2)
    }).pipe(
      map(result => {
        return [...result.within7days, ...result.over7daysNotSurveyed]
      })
    )

    // return of(this.weighingSurveyEntries);
  }

  insert(newOne: VehicleSteelWeighingSurvey) {
    return this.http.post(this.apiURL, newOne, {
      headers: this.setHeaders(true)
    });
  }

  update(patchesObj: {
    _id: string,
    vswsPatches?: any[],
    materials?: {_id?: string, obj?: any, patches?: any[]}[]
  }) {
    console.log(patchesObj)
    return this.http.patch(this.apiURL + '/one', patchesObj, {
      headers: this.setHeaders(true)
    }) as Observable<any>;
  }

  search(searchParams: { [key: string]: any }): Observable<VehicleSteelWeighingSurvey[]> {
    return this.http.post(this.apiURL + '/search', searchParams, {
      headers: this.setHeaders(true)
    }) as Observable<VehicleSteelWeighingSurvey[]>;
  }




}

// export interface VehicleSteelWeighingSurvey {
//   id?: any;
//   truckPlateNo: string;
//   grossWeight: number;
//   wDate?: Date;
//   sDate?: Date;
//   surveyDone: boolean;
// }

