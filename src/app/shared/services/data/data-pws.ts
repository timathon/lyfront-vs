import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculatePatchesService } from '../calculate-patches.service';

export class Pws {
  _id?: any;
  name: string = '';
  unit?: string;
  type?: string;
  idA6?: string;
  hasBrand?: string;
  idForPlan?: string;
  isActive?: string;
  hasIdPerUnit?: string;
  specs?: string[];
  bms?: string;
}


export class DataPws {
  apiURL = this.appConfig.backendUrl + '/api/pws-v2';
  constructor(
    private http: HttpClient,
    private setHeaders: (withJWT: boolean) => HttpHeaders | {
      [header: string]: string | string[];
    },
    private appConfig: any,
    private calculatePatches: CalculatePatchesService
  ) { }


  search(searchParams: { [key: string]: any }): Observable<Pws[]> {
    return this.http.post(this.apiURL + '/search', searchParams, {
      headers: this.setHeaders(true)
    }) as Observable<Pws[]>;
  }
}
