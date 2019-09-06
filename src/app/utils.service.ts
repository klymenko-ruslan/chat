import {Injectable} from '@angular/core';


@Injectable()
export class UtilsService {
  getKeysExclude(data: JSON, exclude) {
    return Object.keys(data).filter(key => !exclude.find(it => key === it));
  }
  getKeys(data: JSON, exclude) {
    return Object.keys(data);
  }
}
