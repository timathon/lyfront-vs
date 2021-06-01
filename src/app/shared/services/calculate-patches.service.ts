import { Injectable } from '@angular/core';
import jsonpatch from 'fast-json-patch';

export interface CalculatePatchesInput {
  oldObject: { [key: string]: any };
  newObject: { [key: string]: any };
  keysToIgnore?: string[];
  objectTemplate?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class CalculatePatchesService {

  constructor() { }

  trimObject(objectN: { [key: string]: any }, objectTemplate: { [key: string]: any }) {
    const objectY: { [key: string]: any } = {};
    const applyX = (objectX: { [key: string]: any }, objectTemplateX: { [key: string]: any }, objectY: { [key: string]: any }) => {
      Object.keys(objectTemplateX).forEach(keyXX => {
        // console.log('on', keyXX);
        if (objectTemplateX[keyXX] && (typeof objectTemplateX[keyXX] !== 'object')) {
          objectY[keyXX] = objectX[keyXX];
        } else {
          if (objectTemplateX[keyXX] && (typeof objectTemplateX[keyXX] === 'object')) {
            // console.log('working on subobject')
            objectY[keyXX] = {};
            objectY[keyXX] = applyX(objectX[keyXX], objectTemplateX[keyXX], objectY[keyXX])
          } else {
            // do nothing
          }
        }
      });
      return objectY;
    }
    applyX(objectN, objectTemplate, objectY);
    return objectY;
  }

  calculatePatches(input: CalculatePatchesInput) {
    let patchesPrepare;
    if (input.keysToIgnore) {
      const prepareObject = (objectX: { [key: string]: any }, keysToIgnore: string[]) => {
        const objectY: { [key: string]: any } = {};
        Object.keys(objectX).filter(keyX => keysToIgnore.indexOf(keyX) === -1).forEach(keyX => {
          objectY[keyX] = objectX[keyX];
        });
        return objectY;
      }
      patchesPrepare = jsonpatch.compare(
        prepareObject(input.oldObject, input.keysToIgnore),
        prepareObject(input.newObject, input.keysToIgnore),
      );

    } else {
      if (input.objectTemplate) {
        patchesPrepare = jsonpatch.compare(
          this.trimObject(input.oldObject, input.objectTemplate),
          this.trimObject(input.newObject, input.objectTemplate),
        );
      } else {
        throw ('bad option for calculate patches');
      }

    }
    return patchesPrepare.map(patch => {
      if (patch.op === 'add') {
        (patch as any).op = 'replace';
      }
      return patch;
    });
  }
}
