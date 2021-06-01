import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculatePatchesService } from '../calculate-patches.service';

export class User {
  _id: any;
  username = '';
  displayName = '';
  isActive?= true;
  facility?= 'f001';
  setting?: { [key: string]: any }
}

export class DataUsers {
  apiURL = this.appConfig.backendUrl + '/api/users';

  constructor(
    private http: HttpClient,
    private setHeaders: (withJWT: boolean) => HttpHeaders | {
      [header: string]: string | string[];
    },
    private appConfig: any,
    private calculatePatches: CalculatePatchesService
  ) { }
  search(searchParams: { [key: string]: any }): Observable<User[]> {
    return this.http.post(this.apiURL + '/search', searchParams, {
      headers: this.setHeaders(true)
    }) as Observable<User[]>;
  }
}
