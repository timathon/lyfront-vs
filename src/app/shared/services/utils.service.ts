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

  toChineseNumber(n: number) {
    if (!Number.isInteger(n) || n < 0) {
      throw Error('请输入自然数');
    }

    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const positions = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿'];
    const charArray = String(n).split('');
    let result = '';
    let prevIsZero = false;
    //处理0  deal zero
    for (let i = 0; i < charArray.length; i++) {
      const ch = charArray[i];
      if (ch !== '0' && !prevIsZero) {
        result += digits[parseInt(ch)] + positions[charArray.length - i - 1];
        prevIsZero = false;
      } else if (ch === '0') {
        prevIsZero = true;
      } else if (ch !== '0' && prevIsZero) {
        result += '零' + digits[parseInt(ch)] + positions[charArray.length - i - 1];
        prevIsZero = false;
      }
    }
    //处理十 deal ten
    if (n < 100) {
      result = result.replace('一十', '十');
    }
    return result;
  }

}
