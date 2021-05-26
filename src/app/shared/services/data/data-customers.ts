import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalculatePatchesService } from '../calculate-patches.service';

export class Customer {
  _id?: any;
  name: string = '';
  mobile?: string = '';
  notes?: string = '';
  createdAt?: Date;
  createdBy?: any;
}

export class DataCustomers {
  apiURL = this.appConfig.backendUrl + '/api/customers';

  constructor(
    private http: HttpClient,
    private setHeaders: (withJWT: boolean) => HttpHeaders | {
      [header: string]: string | string[];
    },
    private appConfig: any,
    private calculatePatches: CalculatePatchesService
  ) {
  }
  search(searchParams: { [key: string]: any }): Observable<Customer[]> {
    return this.http.post(this.apiURL + '/search', searchParams, {
      headers: this.setHeaders(true)
    }) as Observable<Customer[]>;
  }

  save(customerCombo: {
    oldCustomer: Customer,
    newCustomer: Customer
  }) {
    if (customerCombo.oldCustomer._id) {
      // calculate patches
      // return this.patch(customerOld._id, []);
      const patches = this.calculatePatches.calculatePatches({
        oldObject: customerCombo.oldCustomer,
        newObject: customerCombo.newCustomer,
        keysToIgnore: ['_id', 'createdAt', 'createdBy', 'modifiedAt', 'modifiedBy']
      });
      console.log(patches);
      return this.patch(customerCombo.oldCustomer._id, patches);
    } else {
      return this.create(customerCombo.newCustomer);
    }
  }

  create(newCustomer: Customer) {
    return this.http.post(this.apiURL, newCustomer, {
      headers: this.setHeaders(true)
    });
  }

  patch(_id: any, patches: any[]) {
    return this.http.patch(this.apiURL, {
      _id, patches
    }, {
      headers: this.setHeaders(true)
    });
  }

}
