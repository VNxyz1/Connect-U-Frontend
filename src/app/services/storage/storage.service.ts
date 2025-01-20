import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // private _storage!: Storage;

  constructor() {
    this.init();
  }

  async init() {
    // this._storage = await this.storage.create();
  }

  public async set(key: string, value: any): Promise<void> {
    return await Preferences.set({
      key: key,
      value: JSON.stringify(value),
    });
  }

  public async get<T>(key: string): Promise<T | null> {
    const res = await Preferences.get({ key: key });
    if (res.value === null) {
      return res.value;
    }
    return JSON.parse(res.value);
  }

  public async remove(key: string): Promise<void> {
    return await Preferences.remove({ key: key });
  }

  public async clear(): Promise<void> {
    return await Preferences.clear();
  }
}
