import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface VehicleSteelWeighing {
  truckPlateNo: string,
  customerId?: any,
  customerName?: string, // delete before patch
  customerTel?: string, // delete before patch
  inWeightKG?: number,
  inWeighedAt?: Date,
  inWeighedBy?: any,
  inWeighedByName?: string,
  outWeightKG?: number,
  outWeighedAt?: Date,
  outWeighedBy?: any,
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
  pws?: any;
  pwsName?: string;
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
  weighing: VehicleSteelWeighing = {
    truckPlateNo: ''
  };
  survey: VehicleSteelSurvey = {
    materials: []
  }
  changeLogs?: any[] = []; // delete before patch
  constructor() {

  }
}


export class DataVehicleSteel {
  weighingSurveyEntries: VehicleSteelWeighingSurvey[] = [
    {
      _id: 1,
      weighing: {
        truckPlateNo: '辽N12121',
        customerId: '5a328e6ae2870c00146a5065',
        inWeightKG: 2000,
        inWeighedBy: '59251ad024ac463e20bee3a7',
        outWeightKG: 1000,
        outWeighedBy: '59251ad024ac463e20bee3a7',
        notes: 'abc'
      },
      survey: {
        surveyedAt: new Date('2021-5-24'),
        materials: [
          {weightKG: 10}
        ]
      }
    },
    {
      _id: 2,
      weighing: {
        truckPlateNo: '辽N90909',
        customerId: '5a328e6ae2870c00146a5065',
        inWeighedBy: '59251ad024ac463e20bee3a7',
        outWeighedBy: '59251ad024ac463e20bee3a7',

      },
      survey: {
        materials: []
      }
    }
  ];
  constructor(private http: HttpClient) {

  }

  getRecent(): Observable<VehicleSteelWeighingSurvey[]> {
    return of(this.weighingSurveyEntries);
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

