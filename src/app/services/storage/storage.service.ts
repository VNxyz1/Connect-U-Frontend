import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage!: Storage;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any): Promise<void> {
    if (!this._storage) await this.init();
    return this._storage.set(key, value);
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this._storage) await this.init();
    return this._storage.get(key);
  }

  public async remove(key: string): Promise<void> {
    if (!this._storage) await this.init();
    return this._storage.remove(key);
  }

  public async clear(): Promise<void> {
    if (!this._storage) await this.init();
    return this._storage.clear();
  }
}
