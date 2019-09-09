import {Injectable} from '@angular/core';

@Injectable()
export class ByteconverterService {

  bytesToString(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  stringToBytes(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

}
