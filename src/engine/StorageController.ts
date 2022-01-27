export class StorageController {

    constructor() {
        //
    }

    public async SaveFile(): Promise<void> {
        console.warn('StorageController.SaveFile()', '=>', 'Not fully implemented!');
        throw new Error('Not implemented!');
    }

    public async SavePersistent<T>(key: string, value: T): Promise<void> {
        console.warn('StorageController.SavePersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.set({ key: data }, () => {});
        localStorage.setItem(key, JSON.stringify(value));
    }

    public async LoadPersistent<T>(key: string): Promise<T> {
        console.warn('StorageController.LoadPersistent()', '=>', 'Not fully implemented!');
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.get(key, data => data[key]);
        return JSON.parse(localStorage.getItem(key)) as T;
    }
}