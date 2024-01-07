import { APP_NAME } from "../const/Constants";

export class IndexDB {
  private static _instance: IndexDB;
  static get instance(): IndexDB {
    if (!IndexDB._instance) {
      IndexDB._instance = new IndexDB();
    }
    return IndexDB._instance;
  }

  private db: IDBDatabase = null!;
  private dataStoreName = `${APP_NAME}_STORE`;
  public async connect(dbName: string) {
    if (this.db) {
      return Promise.resolve(this.db);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        db.createObjectStore(`${this.dataStoreName}`, {
          keyPath: "id",
        });
      };

      request.onerror = (event) => reject(event);
    });
  }

  public async addItem(key: string, value: any) {
    if (!this.db) await this.connect(APP_NAME);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.dataStoreName],
        "readwrite"
      );
      const store = transaction.objectStore(this.dataStoreName);

      const cacheValue = {
        id: key,
        value: value,
      };

      const request = store.put(cacheValue);
      request.onsuccess = (event: any) => resolve(event);

      request.onerror = (event) => reject(event);
    });
  }

  public async getItem<T>(key: string): Promise<T> {
    if (!this.db) await this.connect(APP_NAME);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.dataStoreName],
        "readwrite"
      );
      const store = transaction.objectStore(this.dataStoreName);
      const getRequest = store.get(key);
      getRequest.onsuccess = (event: any) => {
        resolve(event.target?.result?.value as T);
      };

      getRequest.onerror = (event) => reject(event);
    });
  }

  public async addItemWithExpiry(key: string, value: any, expiry = 60 * 60) {
    if (!this.db) await this.connect(APP_NAME);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.dataStoreName],
        "readwrite"
      );
      const store = transaction.objectStore(this.dataStoreName);

      const now = new Date();
      const expiryDate = new Date(now.getTime() + expiry * 1000);

      const cacheValue = {
        id: key,
        value: value,
        expiry: expiryDate.getTime(),
      };

      const request = store.put(cacheValue);
      request.onsuccess = (event: any) => resolve(event);

      request.onerror = (event) => reject(event);
    });
  }

  public async getItemWithExpiry<T>(key: string): Promise<T> {
    if (!this.db) await this.connect(APP_NAME);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.dataStoreName],
        "readwrite"
      );
      const store = transaction.objectStore(this.dataStoreName);
      const getRequest = store.get(key);

      getRequest.onsuccess = (event: any) => {
        const result = event.target.result;
        const now = new Date();
        if (result && now.getTime() < result.expiry) {
          resolve(result.value as T);
        } else {
          resolve(null!);
        }
      };

      getRequest.onerror = (event) => reject(event);
    });
  }

  public async deleteItem(key: string) {
    if (!this.db) await this.connect(APP_NAME);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.dataStoreName],
        "readwrite"
      );
      const store = transaction.objectStore(this.dataStoreName);

      const deleteRequest = store.delete(key);
      deleteRequest.onsuccess = (event: any) => resolve(event);

      deleteRequest.onerror = (event) => reject(event);
    });
  }
}
