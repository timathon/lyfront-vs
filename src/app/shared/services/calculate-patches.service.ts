import { Injectable } from '@angular/core';
import jsonpatch from 'fast-json-patch';

export interface CalculatePatchesInput {
  oldObject: { [key: string]: any };
  newObject: { [key: string]: any };
  keysToIgnore: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CalculatePatchesService {

  constructor() { }
  calculatePatches(input: CalculatePatchesInput) {
    const prepareObject = (objectX: { [key: string]: any }, keysToIgnore: string[]) => {
      const objectY: { [key: string]: any } = {};
      Object.keys(objectX).filter(keyX => keysToIgnore.indexOf(keyX) === -1).forEach(keyX => {
        objectY[keyX] = objectX[keyX];
      });
      return objectY;
    }
    const patchesPrepare = jsonpatch.compare(
      prepareObject(input.oldObject, input.keysToIgnore),
      prepareObject(input.newObject, input.keysToIgnore),
    );
    return patchesPrepare;
  }
}
