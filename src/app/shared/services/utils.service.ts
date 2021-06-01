import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  compareObjects(object1: { [key: string]: any }, object2: { [key: string]: any }, keys: string[] = []) {
    function deepEqual(object1: any, object2: any) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
          areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2
        ) {
          return false;
        }
      }

      return true;
    }

    function isObject(object: any) {
      return object != null && typeof object === 'object';
    }

    let objectA: any = {}, objectB: any = {};

    if (keys.length) {
      keys.forEach(key => {
        objectA[key] = object1[key];
        objectB[key] = object2[key];
      })
    } else {
      objectA = object1;
      objectB = object2;
    }
    return deepEqual(objectA, objectB);
  }
}
