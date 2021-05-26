import { Inject, Injectable } from '@angular/core';
import { DataVehicleSteel } from './data/data-vehicle-steel';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { DataCustomers } from './data/data-customers';
import { APP_CONFIG } from '@app/app.config';
import { CalculatePatchesService } from './calculate-patches.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataVS: DataVehicleSteel;
  dataCustomers: DataCustomers;
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
    private calculatePatches: CalculatePatchesService

  ) {
    this.dataVS = new DataVehicleSteel(this.http);
    this.dataCustomers = new DataCustomers(this.http, this.setHeaders, this.appConfig, this.calculatePatches);
  }

  setHeaders(withJWT: Boolean = false): HttpHeaders | {
    [header: string]: string | string[];
}{
    let headers;
    if (withJWT) {
      const jwt = JSON.parse(localStorage.getItem('currentUser') as string)['token'];
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      };
    } else {
      headers = { 'Content-Type': 'application/json' };
    }
    return headers;
  }

}

