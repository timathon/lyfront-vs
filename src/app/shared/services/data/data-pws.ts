import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
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

  getPws() {
    return of(localStorage.getItem('pws'))
    .pipe(
      switchMap(pws0 => {
        if (pws0) {
          return of(JSON.parse(pws0));
        } else {
          return this.refreshPws()
        }
      })
    );
  }

  refreshPws() {
    return this.search({}).pipe(
      tap(pws => {
        localStorage.setItem('pws', JSON.stringify(pws));
      }),
      first()
    )
  }

}
