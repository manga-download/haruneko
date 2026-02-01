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

/**
 * Maximum length for a file/directory name to ensure compatibility across file systems.
 * Windows has a 260 character limit for the full path (MAX_PATH), so individual path segments
 * should be kept much shorter to allow for the full path structure.
 * We use 80 as a safe limit for the readable prefix. The hash suffix adds ~8 more characters.
 */
const MAX_PATH_SEGMENT_LENGTH = 80;

/**
 * Generates a short hash from a string using a simple hash algorithm.
 * This is used to create unique identifiers for long filenames while keeping them short.
 * Uses codePointAt to properly handle Unicode characters including emoji.
 */
function GenerateHash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const code = text.codePointAt(i) ?? 0;
        hash = ((31 * hash + code) | 0) >>> 0;
        // Skip the next code unit if this was a surrogate pair
        if (code > 0xFFFF) i++;
    }
    return hash.toString(36);
}

export function SanitizeFileName(name: string, maxLength: number = MAX_PATH_SEGMENT_LENGTH): string {
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
        '~': '～', //https://unicode-explorer.com/c/FF5E //File System API cannot handle trailing hyphens
    };

    // TODO: Reserved names? => CON, PRN, AUX, NUL, COM1, LPT1
    let sanitized = name
        .replace(/[\u0000-\u001F\u007F-\u009F]/gu, '') // https://en.wikipedia.org/wiki/C0_and_C1_control_codes
        .replace(/./g, c => lookup[c] ?? c)
        .replace(/\s+$/, '')
        .trim()
        .replace(/\.+$/, ({ length }) => '․'.repeat(length)) // Must not end with a `.` dot
        .replace(/^\.{2,}/, ({ length }) => '․'.repeat(length)) // Must not begin with more than a single `.` dot
        || 'untitled';

    // If the sanitized name exceeds maxLength, use a prefix + hash approach to preserve uniqueness
    // while staying within path limits. This keeps the filename readable while ensuring no collisions.
    if (sanitized.length > maxLength) {
        const hash = GenerateHash(sanitized);
        const prefixLength = maxLength - hash.length - 1; // -1 for the separator
        const prefix = sanitized.substring(0, prefixLength).trimEnd();
        sanitized = `${prefix}_${hash}`;
    }

    return sanitized;
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