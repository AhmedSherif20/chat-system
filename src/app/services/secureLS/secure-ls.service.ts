import { Injectable } from '@angular/core';
import SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class SecureLSService {
  ls = new SecureLS({ encodingType: 'aes' });

  constructor() {}

  encryptData(key: string, data: any): void {
    this.ls.set(key, data);
  }

  decryptData(key: string): any {
    return this.ls.get(key);
  }

  getAllData(): string[] {
    return this.ls.getAllKeys();
  }

  removeData(key: string): void {
    this.ls.remove(key);
  }

  removeAllData(): void {
    this.ls.removeAll();
  }
}
