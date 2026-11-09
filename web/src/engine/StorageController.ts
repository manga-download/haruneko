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

    /**
     * Get a replacement for the given {@link char} when it is invalid for files in windows, macos or linux.
     * Otherwise return the {@link char} itself.
     */
    const innvalidFilenameCharactersReplacer = (char: string) => ({
        '<': '＜', // https://unicode-table.com/en/FF1C/
        '>': '＞', // https://unicode-table.com/en/FF1E/
        ':': '꞉', // https://unicode-table.com/en/A789/, https://unicode-table.com/en/FF1A/, https://unicode-table.com/en/FE55/
        '"': '＂', // https://unicode-table.com/en/FF02/
        '/': '／', // https://unicode-table.com/en/FF0F/, https://unicode-table.com/en/29F8/, https://unicode-table.com/en/2044/
        '\\': '＼', // https://unicode-table.com/en/FF3C/, https://unicode-table.com/en/29F9/, https://unicode-table.com/en/FE68/, https://unicode-table.com/en/29F5/
        '|': '｜', // https://unicode-table.com/en/FF5C/
        '?': '？', // https://unicode-table.com/en/FF1F/, https://unicode-table.com/en/FE56/
        '*': '＊', // https://unicode-table.com/en/FF0A/
        '~': '～', //https://unicode-explorer.com/c/FF5E //File System API cannot handle trailing hyphens
    }[char] ?? char);

    /**
     * Matches all characters from Unicode Category: {@link https://www.compart.com/en/unicode/category/Cc | Control Characters}
     */
    const invalidControlCharactersPattern = /[\p{Control}]/gu;

    /**
     * Matches all characters from Unicode Category: {@link https://www.compart.com/en/unicode/category/Cf | Format Characters}
     */
    const invalidFormatCharactersPattern = /[\u{FE00}-\u{FE0F}\u{E0001}\u{E0020}-\u{E007F}\p{Format}]/gu;

    // TODO: Reserved names? => CON, PRN, AUX, NUL, COM1, LPT1
    return name
        .replace(invalidControlCharactersPattern, '')
        .replace(invalidFormatCharactersPattern, '')
        .replace(/./g, innvalidFilenameCharactersReplacer)
        .replace(/\s+$/, '')
        .trim()
        .replace(/\.+$/, ({ length }) => '․'.repeat(length)) // Must not end with a `.` dot
        .replace(/^\.{2,}/, ({ length }) => '․'.repeat(length)) // Must not begin with more than a single `.` dot
        .trim()
        || 'untitled';
}