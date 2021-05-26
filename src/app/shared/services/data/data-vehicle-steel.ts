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
  outWeightKG?: number,
  outWeighedAt?: Date,
  outWeighedBy?: any,
  note?: ''
}

export interface VehicleSteelSurvey {
  surveyedBy?: any,
  surveyedAt?: Date,
  materials?: SurveyedMaterial[]
}

export interface SurveyedMaterial {
  type?: any,
  weightKG?: number,
  count?: number,
  cost?: number,
  note?: string,
  inventoryId?: any,
  createdAt?: Date,
  createdBy?: any,
  modifiedAt?: Date,
  modifiedBy?: any,
  isDeleted?: boolean,
  deletedAt?: Date,
  deletedBy?: any,
  deleteNote?: string
}

export class VehicleSteelWeighingSurvey {
  _id?: any = null;
  createdAt?: any = null;
  createdBy?: any = null;
  lastModifiedAt?: any = null;
  isDeleted?: any = false;
  deletedAt?: any = null;
  deletedBy?: any = null;
  weighing: VehicleSteelWeighing = {
    truckPlateNo: ''
  };
  survey: VehicleSteelSurvey = {
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
        customerId: '5a328e6ae2870c00146a5065'
      },
      survey: {
        surveyedAt: new Date('2021-5-24'),
        materials: []
      }
    },
    {
      _id: 2,
      weighing: {
        truckPlateNo: '辽N90909',
      },
      survey: {
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

