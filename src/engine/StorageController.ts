const DataBase = 'HakuNeko';

export enum Store {
    Settings = 'Settings',
    Bookmarks = 'Bookmarks',
    MediaLists = 'MediaLists',
}

const VersionUpgrades = [
    // V0 => V1
    function V1(db: IDBDatabase) {
        db.createObjectStore(Store.Settings);
    },
    // V1 => V2
    function V3(db: IDBDatabase) {
        db.createObjectStore(Store.Bookmarks);
    },
    // V2 => V3
    function V2(db: IDBDatabase) {
        db.createObjectStore(Store.MediaLists);
    },
];

const Version = VersionUpgrades.length;

export class StorageController {

    constructor() {
        //
    }

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

    private async SaveIDB<T>(value: T, store: Store, key?: string): Promise<void> {
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

    private async LoadIDB<T>(store: Store, key?: string): Promise<T> {
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

    private async RemoveIDB(store: Store, key?: string): Promise<void> {
        const db = await this.Connect();
        const tx = db.transaction(store, 'readwrite');
        const bucket = tx.objectStore(store);
        const query = key ? bucket.delete(key) : bucket.clear();
        const promise = new Promise<void>((resolve, reject) => {
            query.onsuccess = () => resolve(/*query.result*/);
            query.onerror = () => reject(query.error);
        });
        tx.oncomplete = () => db.close();
        tx.commit();
        return promise;
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

    public async RemovePersistent(store: Store, key?: string): Promise<void> {
        //console.warn('StorageController.RemovePersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.remove(key, () => {});
        //return localStorage.removeItem(`${store}.${key}`);
        return this.RemoveIDB(store, key);
    }

    public async SaveFile(): Promise<void> {
        console.warn('StorageController.SaveFile()', '=>', 'Not fully implemented!');
        throw new Error('Not implemented!');
    }
}