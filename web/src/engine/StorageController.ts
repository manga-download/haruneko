import { StorageControllerBrowser } from './StorageControllerBrowser';

export const enum Store {
    Settings = 'Settings',
    Bookmarks = 'Bookmarks',
    Itemflags = 'Itemflags',
    TagManager = 'CustomTags',
    MediaLists = 'MediaLists',
}

export interface StorageController {
    SavePersistent<T>(value: T, store: Store, key?: string): Promise<void>;
    LoadPersistent<T>(store: Store, key?: string): Promise<T>;
    RemovePersistent(store: Store, ...keys: string[]): Promise<void>;
    SaveTemporary<T>(value: T): Promise<string>;
    LoadTemporary<T>(key: string): Promise<T>;
    RemoveTemporary(...keys: string[]): Promise<void>;
}

export function CreateStorageController(): StorageController {
    return new StorageControllerBrowser();
}

export function SanitizeFileName(name: string): string {
    const lookup = {
        '<': '＜', // https://unicode-table.com/en/FF1C/
        '>': '＞', // https://unicode-table.com/en/FF1E/
        ':': '꞉', // https://unicode-table.com/en/A789/, https://unicode-table.com/en/FF1A/, https://unicode-table.com/en/FE55/
        '"': '＂', // https://unicode-table.com/en/FF02/
        '/': '／', // https://unicode-table.com/en/FF0F/, https://unicode-table.com/en/29F8/, https://unicode-table.com/en/2044/
        '\\': '＼', // https://unicode-table.com/en/FF3C/, https://unicode-table.com/en/29F9/, https://unicode-table.com/en/FE68/, https://unicode-table.com/en/29F5/
        '|': '｜', // https://unicode-table.com/en/FF5C/
        '?': '？', // https://unicode-table.com/en/FF1F/, https://unicode-table.com/en/FE56/
        '*': '＊', // https://unicode-table.com/en/FF0A/
    };
    return name.replace(/./g, c => c.charCodeAt(0) < 32 ? '' : lookup[c] ?? c).replace(/[\s.]+$/, '').trim() || 'untitled';
}

/*
// https://fjolt.com/article/javascript-new-file-system-api

const dir = HakuNeko.SettingsManager.OpenScope('*').Get('media-directory').Value;
console.log(dir.values());
for(const entry of dir.values())

//const file = await dir.getFileHandle(Date.now().toString(16).toUpperCase() + '.txt', { create: true });
// file.write(blob);
// file.close();
*/