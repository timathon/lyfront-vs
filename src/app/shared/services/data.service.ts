import { Injectable } from '@angular/core';
import { DataVehicleSteel } from './data/data-vehicle-steel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataVS: DataVehicleSteel
  constructor(
    private http: HttpClient
  ) {
    this.dataVS = new DataVehicleSteel(this.http);
  }

}

