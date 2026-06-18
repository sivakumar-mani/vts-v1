import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {
  encryptSecretKey = 'r10s20*kjil#thfvd_2021&ywqasxmkl';
  constructor() { }


  // Data Encryption Function
  encryptData(message: any) {
    const keySize = 256;
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
    return result;
  }

  decrypt(ciphertextB64: any) {
    const parsekey = CryptoJS.enc.Utf8.parse(this.encryptSecretKey);
    const parseiv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    const decrypted = CryptoJS.AES.decrypt(ciphertextB64, parsekey, { iv: parseiv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
