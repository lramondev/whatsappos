// storage.service.ts
import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private secretKey = 'suaChaveSecretaMuitoLongaEUnicaAqui12345678901234567890';

  set(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
    localStorage.setItem(key, encrypted);
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const decrypted = CryptoJS.AES.decrypt(item, this.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}