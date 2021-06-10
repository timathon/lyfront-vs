import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { CalculatePatchesService } from '../calculate-patches.service';


export interface PriceNumber {
  default: number
}

export interface Price {
  _id?: any;
  brandId?: any;
  model?: any;
  pwId: any;
  numbers: PriceNumber
}


export class DataPrices {
  apiURL = this.appConfig.backendUrl + '/api/prices-v3';
  constructor(
    private http: HttpClient,
    private setHeaders: (withJWT: boolean) => HttpHeaders | {
      [header: string]: string | string[];
    },
    private appConfig: any,
    private calculatePatches: CalculatePatchesService
  ) { }

  getPrices3(searchParams: { brandId?: string, model?: string, pwId?: string, spec?: string }, exact = false) {
    const searchParamsX: any = {};
    // remove empty string
    Object.keys(searchParams).forEach(key => {
      if ((searchParams as any)[key]) {
        searchParamsX[key] = (searchParams as any)[key];
      }
    });

    return this.http.post(this.apiURL + `/search?exact=${exact}`, searchParamsX, {
      headers: this.setHeaders(true)
    });
  }
}
