import { Inject, Injectable } from '@angular/core';
import { DataVehicleSteel } from './data/data-vehicle-steel';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { DataCustomers } from './data/data-customers';
import { DataUsers } from './data/data-users';
import { APP_CONFIG } from '@app/app.config';
import { CalculatePatchesService } from './calculate-patches.service';
import { DataPws } from './data/data-pws';
import { forkJoin, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataVS: DataVehicleSteel;
  dataCustomers: DataCustomers;
  dataUsers: DataUsers;
  dataPws: DataPws;
  cache: {[key: string]: any} = {};
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
    private calculatePatches: CalculatePatchesService

  ) {
    this.dataVS = new DataVehicleSteel(this.http, this.setHeaders, this.appConfig);
    this.dataCustomers = new DataCustomers(this.http, this.setHeaders, this.appConfig, this.calculatePatches);
    this.dataUsers = new DataUsers(this.http, this.setHeaders, this.appConfig, this.calculatePatches);
    this.dataPws = new DataPws(this.http, this.setHeaders, this.appConfig, this.calculatePatches);
    this.cacheInit();
  }

  
  cacheInit() {
    forkJoin({
      pws: this.dataPws.getPws()
    }).pipe(first()).subscribe(results => {
      this.cache = results;
    });
    
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

