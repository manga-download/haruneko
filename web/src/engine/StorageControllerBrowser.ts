import { type StorageController, Store } from './StorageController';

const DataBase = 'HakuNeko';

const enum InternalStore {
    TemporaryData = 'TemporaryData',
}

type UnitedStore = Store | InternalStore;

const VersionUpgrades = [
    // V0 => V1
    function V1(db: IDBDatabase) {
        db.createObjectStore(Store.Settings);
    },
    // V1 => V2
    function V2(db: IDBDatabase) {
        db.createObjectStore(Store.Bookmarks);
    },
    // V2 => V3
    function V3(db: IDBDatabase) {
        db.createObjectStore(Store.MediaLists);
    },
    // V3 => V4
    function V4(db: IDBDatabase) {
        db.createObjectStore(InternalStore.TemporaryData);
    },
    // V4 => V5
    function V5(db: IDBDatabase) {
        db.createObjectStore(Store.Itemflags);
    },
];

const Version = VersionUpgrades.length;

/**
 * A storage controller that uses the {@link indexedDB} and the {@link https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API|File System Access API}.
 * It is intended to be used within modern web-browsers.
 */
export class StorageControllerBrowser implements StorageController {

    private async Connect(): Promise<IDBDatabase> {
        const connection = indexedDB.open(DataBase, Version);
        return new Promise<IDBDatabase>((resolve, reject) => {
            connection.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = connection.result; // => event.target.result
                for(let version = event.oldVersion; version < event.newVersion; version++) {
                    VersionUpgrades[version](db);
                }
            };
            connection.onsuccess = () => resolve(connection.result);
            connection.onerror = () => reject(connection.error);
        });
    }

    private async SaveIDB<T>(value: T, store: UnitedStore, key?: string): Promise<void> {
        const db = await this.Connect();
        const tx = db.transaction(store, 'readwrite');
        const bucket = tx.objectStore(store);
        const queries = key ? [ bucket.put(value, key) ] : Object.keys(value).map(key => bucket.put(value[key], key));
        const promises = queries.map(query => new Promise<void>((resolve, reject) => {
            query.onsuccess = () => resolve(/*query.result*/);
            query.onerror = () => reject(query.error);
        }));
        tx.oncomplete = () => db.close();
        tx.commit();
        await Promise.all(promises);
    }

    private async LoadIDB<T>(store: UnitedStore, key?: string): Promise<T> {
        const db = await this.Connect();
        const tx = db.transaction(store, 'readonly');
        const bucket = tx.objectStore(store);
        const query = key ? bucket.get(key) : bucket.getAll();
        const promise = new Promise<T>((resolve, reject) => {
            query.onsuccess = () => resolve(query.result as T);
            query.onerror = () => reject(query.error);
        });
        tx.oncomplete = () => db.close();
        tx.commit();
        return promise;
    }

    private async RemoveIDB(store: UnitedStore, ...keys: string[]): Promise<void> {
        const db = await this.Connect();
        const tx = db.transaction(store, 'readwrite');
        const bucket = tx.objectStore(store);
        const queries = keys.length > 0 ? keys.map(key => bucket.delete(key)) : [ bucket.clear() ];
        const promises = queries.map(query => new Promise<void>((resolve, reject) => {
            query.onsuccess = () => resolve(/*query.result*/);
            query.onerror = () => reject(query.error);
        }));
        tx.oncomplete = () => db.close();
        tx.commit();
        await Promise.all(promises);
    }

    public async SavePersistent<T>(value: T, store: Store, key?: string): Promise<void> {
        //console.warn('StorageController.SavePersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.set({ key: data }, () => {});
        //return localStorage.setItem(`${store}.${key}`, JSON.stringify(value));
        return this.SaveIDB(value, store, key);
    }

    public async LoadPersistent<T>(store: Store, key?: string): Promise<T> {
        //console.warn('StorageController.LoadPersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.get(key, data => data[key]);
        //return JSON.parse(localStorage.getItem(`${store}.${key}`)) as T;
        return this.LoadIDB(store, key);
    }

    public async RemovePersistent(store: Store, ...keys: string[]): Promise<void> {
        //console.warn('StorageController.RemovePersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.remove(key, () => {});
        //return localStorage.removeItem(`${store}.${key}`);
        return this.RemoveIDB(store, ...keys);
    }

    public async SaveTemporary<T>(value: T): Promise<string> {
        const key = Date.now().toString() + Math.random().toString();
        await this.SaveIDB(value, InternalStore.TemporaryData, key);
        return key;
    }

    public async LoadTemporary<T>(key: string): Promise<T> {
        return this.LoadIDB(InternalStore.TemporaryData, key);
    }

    public async RemoveTemporary(...keys: string[]): Promise<void> {
        return this.RemoveIDB(InternalStore.TemporaryData, ...keys);
    }
}